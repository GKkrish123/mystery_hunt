import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "firebase-user";
import { z } from "zod";
import {
  defaultMysteryInteraction,
  MysteryCollections,
  type MysteryFormValues,
} from "@/server/constants";
import { type Mystery } from "@/server/model/mysteries";
import {
  type Achievement,
  type HunterTrail,
} from "@/server/model/hunter-trails";
import { chunkArray, shuffleArray } from "@/lib/utils";
import { type HunterRank } from "@/server/model/hunters";
import {
  fetchMysteriesByIdChunks,
  snapshotsToMysteries,
} from "../helpers/mystery";
import { getCachedLike, getHuntersRankList } from "../helpers/hunter";
import {
  getHunterById,
  getHunterTrailById,
  parseSnapshotDoc,
} from "../helpers/query";
import { type MysterySecret } from "@/server/model/secret-chamber";
import { snapshotsToCategories } from "../helpers/category";
import {
  type MysteryEventBasic,
  type MysteryEvent,
} from "@/server/model/events";

export const mysteryRouter = createTRPCRouter({
  getMysteries: privateProcedure
    .input(
      z.object({
        search: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { search, tags } = input;
      const mysteriesCollection = collection(db, MysteryCollections.mysteries);

      let queryRef = query(mysteriesCollection, orderBy("createdAt", "desc"));
      if (search) {
        queryRef = query(
          queryRef,
          where(
            "searchKeywords",
            "array-contains",
            search.trim().toLowerCase(),
          ),
        );
      }
      if (tags) {
        tags.forEach((tag) => {
          queryRef = query(queryRef, where("tags", "array-contains", tag));
        });
      }

      const querySnapshot = await getDocs(queryRef);
      const mysteries = await snapshotsToMysteries(
        querySnapshot,
        ctx.redis,
        ctx.user.hunterId,
      );
      return mysteries;
    }),

  getMysteryById: privateProcedure
    .input(z.object({ mysteryId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { mysteryId } = input;
      const { redis, user } = ctx;
      const mysteryDoc = await getDoc(
        doc(db, MysteryCollections.mysteries, mysteryId),
      );
      if (!mysteryDoc.exists()) {
        return null;
      }
      const now = Date.now();
      const mysteryDocData = mysteryDoc.data() as Mystery;
      if (mysteryDocData.scheduledAt.seconds * 1000 > now) {
        return null;
      }
      const mysteryData = {
        ...(parseSnapshotDoc(mysteryDocData) as Mystery),
        isLiked: await getCachedLike(redis, user.hunterId, mysteryId),
        id: mysteryDoc.id,
      } as Mystery;
      let topThree: HunterRank[] = [];
      if (mysteryData.solvedBy.length > 0) {
        const huntersCollection = query(
          collection(db, MysteryCollections.hunters),
          where(documentId(), "in", [
            mysteryData.solvedBy.map((solved) => solved.hunterId)[0],
          ]),
        );
        const querySnapshot = await getDocs(huntersCollection);
        topThree = getHuntersRankList(querySnapshot);
      }
      let eventData = undefined;
      if (mysteryData.linkedEvent) {
        const eventDoc = await getDoc(
          doc(db, MysteryCollections.events, mysteryData.linkedEvent),
        );
        if (eventDoc.exists()) {
          const { scheduledFrom, scheduledTo, expiresAt } = parseSnapshotDoc(
            eventDoc.data(),
          ) as MysteryEvent;
          eventData = {
            scheduledFrom,
            scheduledTo,
            expiresAt,
          } as MysteryEventBasic;
        }
      }
      const hunterTrailsSnapshot = await getHunterTrailById(ctx.user.hunterId);
      const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;
      const triesLeft =
        mysteryData.maxTries -
        (hunterTrailsData?.interactions?.mysteries?.[mysteryData.id]
          ?.guessCount ?? 0);
      const isLiked =
        !!hunterTrailsData?.interactions?.mysteries?.[mysteryData.id]?.isLiked;
      const isSolved =
        !!hunterTrailsData?.interactions?.mysteries?.[mysteryData.id]?.isSolved;
      const lastTriedAt =
        hunterTrailsData?.interactions?.mysteries?.[
          mysteryId
        ]?.lastGuessedAt?.toMillis();
      const solvedTrail = isSolved
        ? hunterTrailsData?.trails?.find(
            (trail) => trail.mysteryId === mysteryData.id && trail.isSolved,
          )
        : undefined;
      const actualSecret = solvedTrail?.guessedValue;
      const actualPoints = solvedTrail?.points;
      return {
        ...mysteryData,
        isLiked,
        topThree,
        triesLeft,
        isSolved,
        lastTriedAt,
        actualSecret,
        actualPoints,
        eventData,
      } as Mystery & MysteryFormValues;
    }),

  getTrendingMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const trendingQuery = query(
      mysteriesCollection,
      orderBy("viewsInLast24Hours", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(trendingQuery);
    const mysteries = await snapshotsToMysteries(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return mysteries;
  }),

  getShuffledMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const randomAscQuery = query(
      mysteriesCollection,
      orderBy("createdAt", "asc"),
      limit(10),
    );
    const randomDescQuery = query(
      mysteriesCollection,
      orderBy("createdAt", "desc"),
      limit(10),
    );
    const mysteriesArray = await Promise.all(
      [randomAscQuery, randomDescQuery].map(async (q) => {
        const querySnapshot = await getDocs(q);
        return await snapshotsToMysteries(
          querySnapshot,
          ctx.redis,
          ctx.user.hunterId,
        );
      }),
    );
    const mysteries = shuffleArray(mysteriesArray.flat()) as Mystery[];
    const randomMysteries: Mystery[] = [];
    const insertedMysteries: string[] = [];
    mysteries.forEach((mystery) => {
      if (
        insertedMysteries.length === 5 ||
        insertedMysteries.includes(mystery.id)
      ) {
        return;
      }
      randomMysteries.push(mystery);
      insertedMysteries.push(mystery.id);
    });
    return randomMysteries;
  }),

  getPopularMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const trendingQuery = query(
      mysteriesCollection,
      orderBy("viewsCount", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(trendingQuery);
    const mysteries = await snapshotsToMysteries(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return mysteries;
  }),

  getMostLikedMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const mostLikedQuery = query(
      mysteriesCollection,
      orderBy("likesCount", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(mostLikedQuery);
    const mysteries = await snapshotsToMysteries(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return mysteries;
  }),

  getMostGuessedMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const mostLikedQuery = query(
      mysteriesCollection,
      where("guessCount", ">", 0),
      orderBy("guessCount", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(mostLikedQuery);
    const mysteries = await snapshotsToMysteries(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return mysteries;
  }),

  getMostSolvedMysteries: privateProcedure.query(async ({ ctx }) => {
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const mostLikedQuery = query(
      mysteriesCollection,
      where("solvedCount", ">", 0),
      orderBy("solvedCount", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(mostLikedQuery);
    const mysteries = await snapshotsToMysteries(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return mysteries;
  }),

  getHallOfFameMysteries: privateProcedure.query(async ({ ctx }) => {
    const categoriesCollection = collection(db, MysteryCollections.categories);
    const recentsQuery = query(
      categoriesCollection,
      orderBy("updatedAt", "desc"),
      limit(4),
    );
    const querySnapshot = await getDocs(recentsQuery);
    const categories = await snapshotsToCategories(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    const mysteriesCollection = collection(db, MysteryCollections.mysteries);
    const hallOfFameMysteries = await Promise.all(
      categories.map(async (category) => {
        const hallOfFameQuery = query(
          mysteriesCollection,
          where("tags", "array-contains", category.tag),
          orderBy("createdAt", "desc"),
          limit(5),
        );
        const querySnapshot = await getDocs(hallOfFameQuery);
        return {
          category,
          mysteries: await snapshotsToMysteries(
            querySnapshot,
            ctx.redis,
            ctx.user.hunterId,
          ),
        };
      }),
    );
    return hallOfFameMysteries;
  }),

  getProgressMysteries: privateProcedure.query(async ({ ctx }) => {
    const hunterId = ctx.user.hunterId;
    const hunterTrailsSnapshot = await getHunterTrailById(hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;

    const progressMysteries = hunterTrailsData?.interactions?.mysteries || {};
    const progressMysteryIds = Object.keys(progressMysteries);
    const idChunks = chunkArray(progressMysteryIds, 10);

    const mysteriesPromises = fetchMysteriesByIdChunks(
      idChunks,
      hunterTrailsData?.interactions?.mysteries,
    );

    const mysteriesArray = await Promise.all(mysteriesPromises);
    const mysteries = mysteriesArray.flat();

    mysteries.sort((a, b) => {
      const aProgress = progressMysteries[a.id];
      const bProgress = progressMysteries[b.id];
      if (aProgress?.lastViewedAt && bProgress?.lastViewedAt) {
        return (
          bProgress.lastViewedAt.toMillis() - aProgress.lastViewedAt.toMillis()
        );
      }
      return 0;
    });
    return mysteries;
  }),

  getAchievements: privateProcedure.query(async ({ ctx }) => {
    const hunterId = ctx.user.hunterId;
    const hunterDoc = await getHunterById(hunterId);
    if (!hunterDoc) {
      throw new Error("User not found", {
        cause: "user-not-found",
      });
    }
    const hunterTrailsSnapshot = await getHunterTrailById(hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;
    const solvedTrails = (hunterTrailsData?.trails || []).filter(
      (trail) => trail.isSolved,
    );
    const solvedMysteryIds = [
      ...new Set(solvedTrails.map((trail) => trail.mysteryId)),
    ];
    const idChunks = chunkArray(solvedMysteryIds, 10);
    const mysteriesPromises = fetchMysteriesByIdChunks(
      idChunks,
      hunterTrailsData?.interactions?.mysteries,
    );
    const mysteriesArray = await Promise.all(mysteriesPromises);
    const mysteries = mysteriesArray.flat();
    solvedTrails.sort(
      (a, b) => b.guessedAt.toMillis() - a.guessedAt.toMillis(),
    );
    let lastScored = 0;
    const achievements = solvedTrails
      .map(({ guessCount, guessedValue, mysteryId, points, achievement }) => {
        const targetMystery = mysteries.find(
          (mystery) => mystery.id === mysteryId,
        );
        if (!targetMystery) return null;
        if (!lastScored) {
          lastScored = points ?? 0;
        }
        return {
          guessCount,
          guessedValue,
          name: targetMystery.title,
          imgUrl: targetMystery.thumbnailUrl,
          points: points ?? 0,
          achievement: achievement ?? "",
        } as Achievement;
      })
      .filter((achievement) => achievement !== null);

    return { lastScored, scoreBoard: hunterDoc.scoreBoard, achievements };
  }),

  recordMysteryView: privateProcedure
    .input(z.object({ mysteryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { mysteryId } = input;
      const timestamp = Date.now();
      const redis = ctx.redis;
      const hunterTrail = await getHunterTrailById(ctx.user.hunterId);
      if (!hunterTrail.exists()) {
        return { success: false, viewTime: timestamp };
      }
      const mysteryViewCount = await redis.get(
        `mystery:viewCount:${mysteryId}`,
      );
      if (!mysteryViewCount) {
        const docRef = doc(db, MysteryCollections.mysteries, mysteryId);
        await runTransaction(db, async (transaction) => {
          const docSnapshot = await transaction.get(docRef);
          if (!docSnapshot.exists()) {
            throw new Error("Document does not exist!");
          }
          const data = docSnapshot.data();
          if (!data?.firstViewedAt) {
            transaction.update(docRef, { firstViewedAt: new Date(timestamp) });
          }
        });
      }
      const hunterTrailData = hunterTrail.data() as HunterTrail;
      const currentMysteryInteractions =
        hunterTrailData.interactions.mysteries?.[mysteryId];
      if (!currentMysteryInteractions) {
        await updateDoc(
          doc(db, MysteryCollections.hunterTrails, hunterTrail.id),
          {
            [`interactions.mysteries.${mysteryId}`]: {
              ...defaultMysteryInteraction,
              lastViewedAt: new Date(timestamp),
              viewCount: 1,
            },
          },
        );
      } else {
        await updateDoc(
          doc(db, MysteryCollections.hunterTrails, hunterTrail.id),
          {
            [`interactions.mysteries.${mysteryId}.lastViewedAt`]: new Date(
              timestamp,
            ),
            [`interactions.mysteries.${mysteryId}.viewCount`]: increment(1),
          },
        );
      }

      // Update mystery view count in the redis cache
      const redisKeyViewCount = `mystery:viewCount:${mysteryId}`;
      const redisKeyRecentViews = `mystery:recentViews:${mysteryId}`;

      await redis.incr(redisKeyViewCount);
      await redis.zadd(redisKeyRecentViews, timestamp, String(timestamp));
      const cutoffTime = timestamp - 24 * 60 * 60 * 1000;
      await redis.zremrangebyscore(redisKeyRecentViews, 0, cutoffTime);

      return { success: true, viewTime: timestamp };
    }),

  recordLastView: privateProcedure
    .input(z.object({ mysteryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { mysteryId } = input;
      const hunterTrailDoc = await getHunterTrailById(ctx.user.hunterId);
      if (!hunterTrailDoc.exists()) {
        return;
      }
      await updateDoc(
        doc(db, MysteryCollections.hunterTrails, hunterTrailDoc.id),
        {
          [`interactions.mysteries.${mysteryId}.lastViewedAt`]:
            serverTimestamp(),
        },
      );

      return { success: true };
    }),

  toggleLikeMystery: privateProcedure
    .input(
      z.object({
        mysteryId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { mysteryId } = input;
      const { redis, user } = ctx;
      const mysteryRef = doc(db, MysteryCollections.mysteries, mysteryId);
      const hunterTrailsRef = doc(
        db,
        MysteryCollections.hunterTrails,
        user.hunterId,
      );

      await runTransaction(db, async (transaction) => {
        const mysteryDoc = await transaction.get(mysteryRef);
        const hunterTrailDoc = await transaction.get(hunterTrailsRef);

        if (mysteryDoc.exists() && hunterTrailDoc.exists()) {
          const hunterTrailData = hunterTrailDoc.data() as HunterTrail;
          if (hunterTrailData.interactions.mysteries?.[mysteryId]?.isLiked) {
            transaction.update(mysteryRef, {
              likesCount: increment(-1),
            });
            transaction.update(hunterTrailsRef, {
              [`interactions.mysteries.${mysteryId}.isLiked`]: false,
            });
            await redis.set(
              `mystery:like:${user.hunterId}-${mysteryId}`,
              "false",
              "EX",
              60 * 60,
            );
          } else {
            transaction.update(mysteryRef, {
              likesCount: increment(1),
            });
            transaction.update(hunterTrailsRef, {
              [`interactions.mysteries.${mysteryId}.isLiked`]: true,
              [`interactions.mysteries.${mysteryId}.likedAt`]:
                serverTimestamp(),
            });
            await redis.set(
              `mystery:like:${user.hunterId}-${mysteryId}`,
              "true",
              "EX",
              60 * 60,
            );
          }
        }
      });
      return { success: true };
    }),

  verifyMysterySecret: privateProcedure
    .input(
      z.object({
        mysteryId: z.string(),
        secret: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { mysteryId, secret } = input;
      const secretChamberDoc = await getDoc(
        doc(db, MysteryCollections.secretChamber, mysteryId),
      );
      if (!secretChamberDoc.exists()) {
        return { success: false, message: "Invalid mystery." };
      }
      const secretData = secretChamberDoc.data() as MysterySecret;
      const hunterTrailRef = doc(
        db,
        MysteryCollections.hunterTrails,
        ctx.user.hunterId,
      );
      const mysteryRef = doc(db, MysteryCollections.mysteries, mysteryId);
      const hunterTrailDoc = await getDoc(hunterTrailRef);
      const mysteryDoc = await getDoc(mysteryRef);
      if (!hunterTrailDoc.exists() || !mysteryDoc.exists()) {
        return { success: false, message: "Invalid mystery or hunter." };
      }
      const now = Date.now();
      const mysteryData = mysteryDoc.data() as Mystery;
      if (mysteryData.scheduledAt.seconds * 1000 > now) {
        return { success: false, message: "Too soon... Too soon..." };
      }
      const serverTimestampValue = new Date(now);
      const hunterTrailData = hunterTrailDoc.data() as HunterTrail;
      const newGuessCount =
        (hunterTrailData.interactions.mysteries?.[mysteryId]?.guessCount ?? 0) +
        1;

      const lastTriedAt =
        hunterTrailData.interactions.mysteries?.[mysteryId]?.lastGuessedAt;
      if (
        lastTriedAt &&
        now - lastTriedAt.toMillis() < mysteryData.retryInterval * 1000
      ) {
        return { success: false, message: "Please wait before trying again." };
      } else if (
        hunterTrailData.interactions.mysteries?.[mysteryId]?.isSolved
      ) {
        return {
          success: false,
          message: "This mystery has already been solved.",
        };
      } else if (newGuessCount > mysteryData.maxTries) {
        return { success: false, message: "You have exhausted all tries." };
      }

      if (secretData.secret === secret) {
        let currentPoints = mysteryData.maxPoints;
        if (currentPoints !== mysteryData.minPoints) {
          const cooldown =
            mysteryData.solvedCount === 0
              ? mysteryData.preFindCooldown
              : mysteryData.postFindCooldown;
          const cooldownCut =
            mysteryData.solvedCount === 0
              ? mysteryData.preFindCooldownCut
              : mysteryData.postFindCooldownCut;
          const targetTime =
            mysteryData.solvedCount === 0
              ? mysteryData.firstViewedAt?.toMillis()
              : mysteryData.solvedBy?.[0]?.solvedAt?.toMillis();
          const elapsedTime = (now - (targetTime ?? now)) / 1000;
          const cooldownPeriods = Math.floor(elapsedTime / cooldown);
          const pointsLost = cooldownPeriods * cooldownCut;
          currentPoints = Math.max(
            mysteryData.maxPoints - pointsLost,
            mysteryData.minPoints,
          );
        }

        await runTransaction(db, async (transaction) => {
          let isOnEvent = false;
          if (mysteryData.linkedEvent) {
            const eventDoc = await transaction.get(
              doc(db, MysteryCollections.events, mysteryData.linkedEvent),
            );
            if (eventDoc.exists()) {
              const eventData = eventDoc.data() as MysteryEvent;
              isOnEvent =
                eventData.scheduledFrom.seconds * 1000 >= now &&
                now <= eventData.scheduledTo.seconds * 1000;
            }
          }
          transaction.update(mysteryRef, {
            lastGuessedAt: serverTimestampValue,
            lastSolvedAt: serverTimestampValue,
            solvedCount: increment(1),
            guessCount: increment(1),
            ...(mysteryData.solvedBy.length < 3
              ? {
                  solvedBy: [
                    ...mysteryData.solvedBy,
                    {
                      hunterId: ctx.user.hunterId,
                      solvedAt: serverTimestampValue,
                      guessCount: newGuessCount,
                      points: currentPoints,
                    },
                  ],
                }
              : {}),
          });
          transaction.update(hunterTrailRef, {
            [`interactions.mysteries.${mysteryId}.lastGuessedAt`]:
              serverTimestampValue,
            [`interactions.mysteries.${mysteryId}.guessCount`]: newGuessCount,
            [`interactions.mysteries.${mysteryId}.isSolved`]: true,
            trails: arrayUnion({
              guessCount: newGuessCount,
              guessedAt: serverTimestampValue,
              guessedValue: secret,
              isSolved: true,
              points: currentPoints,
              achievement: secretData.achievement,
              mysteryId,
            }),
          });
          transaction.update(
            doc(db, MysteryCollections.hunters, ctx.user.hunterId),
            {
              "scoreBoard.totalScore": increment(currentPoints),
              "scoreBoard.lastScoredAt": serverTimestampValue,
              ...(isOnEvent
                ? {
                    [`scoreBoard.eventScores.${mysteryData.linkedEvent}`]:
                      increment(currentPoints),
                    [`scoreBoard.eventsLastScoredAt.${mysteryData.linkedEvent}`]:
                      serverTimestampValue,
                  }
                : {}),
            },
          );
        });
        return {
          success: true,
          message: "Congratulations! Mystery solved.",
          points: currentPoints,
          mysteryUpdate: {
            isSolved: true,
            lastGuessedAt: now,
            lastTriedAt: now,
            lastSolvedAt: now,
            solvedCount: mysteryData.solvedCount + 1,
            guessCount: mysteryData.guessCount + 1,
            solvedBy: [
              ...mysteryData.solvedBy,
              {
                hunterId: ctx.user.hunterId,
                solvedAt: now,
                guessCount: newGuessCount,
                points: currentPoints,
              },
            ],
          },
        };
      } else {
        await runTransaction(db, async (transaction) => {
          transaction.update(mysteryRef, {
            lastGuessedAt: serverTimestampValue,
            guessCount: increment(1),
          });
          transaction.update(hunterTrailRef, {
            [`interactions.mysteries.${mysteryId}.lastGuessedAt`]:
              serverTimestampValue,
            [`interactions.mysteries.${mysteryId}.guessCount`]: newGuessCount,
            [`interactions.mysteries.${mysteryId}.isSolved`]: false,
            trails: arrayUnion({
              guessCount: newGuessCount,
              guessedAt: serverTimestampValue,
              guessedValue: secret,
              isSolved: false,
              mysteryId,
            }),
          });
        });

        return {
          success: false,
          message: "Incorrect secret.",
          mysteryUpdate: {
            lastGuessedAt: now,
            lastTriedAt: now,
            guessCount: mysteryData.guessCount + 1,
          },
        };
      }
    }),
});
