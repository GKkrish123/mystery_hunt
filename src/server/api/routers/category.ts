import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  collection,
  doc,
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
  defaultCategoryInteraction,
  MysteryCollections,
} from "@/server/constants";
import { type Category } from "@/server/model/categories";
import { snapshotsToCategories } from "../helpers/category";
import { getHunterTrailById, parseSnapshotDoc } from "../helpers/query";
import { type HunterTrail } from "@/server/model/hunter-trails";
import { shuffleArray } from "@/lib/utils";
import { getCachedBookmark } from "../helpers/hunter";

export const categoryRouter = createTRPCRouter({
  getCategoryByTag: privateProcedure
    .input(z.object({ tag: z.string() }))
    .query(async ({ input, ctx }) => {
      const { tag } = input;
      const categoryDoc = await getDocs(
        query(
          collection(db, MysteryCollections.categories),
          where("tag", "==", tag),
          limit(1),
        ),
      );
      if (categoryDoc.empty || !categoryDoc.docs[0]) {
        return null;
      }
      return {
        ...(parseSnapshotDoc(categoryDoc.docs[0].data()) as Category),
        isBookmarked: await getCachedBookmark(
          ctx.redis,
          ctx.user.hunterId,
          categoryDoc.docs[0].id,
        ),
        id: categoryDoc.docs[0].id,
      } as Category;
    }),

  getCategories: privateProcedure
    .input(z.object({ search: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const { search } = input;
      const categoriesCollection = collection(
        db,
        MysteryCollections.categories,
      );

      let queryRef = query(categoriesCollection, orderBy("createdAt", "desc"));
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

      const querySnapshot = await getDocs(queryRef);
      const categories = await snapshotsToCategories(
        querySnapshot,
        ctx.redis,
        ctx.user.hunterId,
      );
      return categories;
    }),

  getShuffledCategories: privateProcedure.query(async ({ ctx }) => {
    const categoriesCollection = collection(db, MysteryCollections.categories);
    const randomAscQuery = query(
      categoriesCollection,
      orderBy("createdAt", "asc"),
      limit(10),
    );
    const randomDescQuery = query(
      categoriesCollection,
      orderBy("createdAt", "desc"),
      limit(10),
    );
    const categoriesArray = await Promise.all(
      [randomAscQuery, randomDescQuery].map(async (q) => {
        const querySnapshot = await getDocs(q);
        return await snapshotsToCategories(
          querySnapshot,
          ctx.redis,
          ctx.user.hunterId,
        );
      }),
    );
    const categories = shuffleArray(categoriesArray.flat()) as Category[];
    const randomCategories: Category[] = [];
    const insertedCategories: string[] = [];
    categories.forEach((mystery) => {
      if (
        insertedCategories.length === 5 ||
        insertedCategories.includes(mystery.id)
      ) {
        return;
      }
      randomCategories.push(mystery);
      insertedCategories.push(mystery.id);
    });
    return randomCategories;
  }),

  getFeaturedCategories: privateProcedure.query(async ({ ctx }) => {
    const categoriesCollection = collection(db, MysteryCollections.categories);
    const mostViewedQuery = query(
      categoriesCollection,
      orderBy("createdAt", "desc"),
      limit(6),
    );
    const querySnapshot = await getDocs(mostViewedQuery);
    const categories = await snapshotsToCategories(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return categories;
  }),

  getPopularCategories: privateProcedure.query(async ({ ctx }) => {
    const categoriesCollection = collection(db, MysteryCollections.categories);
    const mostViewedQuery = query(
      categoriesCollection,
      orderBy("viewsCount", "desc"),
      limit(10),
    );
    const querySnapshot = await getDocs(mostViewedQuery);
    const categories = await snapshotsToCategories(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return categories;
  }),

  getMostWatchedCategories: privateProcedure.query(async ({ ctx }) => {
    const categoriesCollection = collection(db, MysteryCollections.categories);
    const querySnapshot = await getDocs(
      query(categoriesCollection, orderBy("bookmarkCount", "desc"), limit(10)),
    );
    const categories = await snapshotsToCategories(
      querySnapshot,
      ctx.redis,
      ctx.user.hunterId,
    );
    return categories;
  }),

  recordCategoryView: privateProcedure
    .input(z.object({ categoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { categoryId } = input;
      const redis = ctx.redis;
      const hunterTrail = await getHunterTrailById(ctx.user.hunterId);
      if (!hunterTrail.exists()) {
        return;
      }
      const hunterTrailData = hunterTrail.data() as HunterTrail;
      const currentCategoryInteractions =
        hunterTrailData.interactions.categories?.[categoryId];
      if (!currentCategoryInteractions) {
        await updateDoc(
          doc(db, MysteryCollections.hunterTrails, hunterTrail.id),
          {
            [`interactions.categories.${categoryId}`]: {
              ...defaultCategoryInteraction,
              lastViewedAt: serverTimestamp(),
              viewCount: 1,
            },
          },
        );
      } else {
        await updateDoc(
          doc(db, MysteryCollections.hunterTrails, hunterTrail.id),
          {
            [`interactions.categories.${categoryId}.lastViewedAt`]:
              serverTimestamp(),
            [`interactions.categories.${categoryId}.viewCount`]: increment(1),
          },
        );
      }
      // Update category view count in the redis cache
      const redisKeyViewCount = `category:viewCount:${categoryId}`;
      await redis.incr(redisKeyViewCount);

      return { success: true };
    }),

  recordLastView: privateProcedure
    .input(z.object({ categoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { categoryId } = input;
      const hunterTrailDoc = await getHunterTrailById(ctx.user.hunterId);
      if (!hunterTrailDoc.exists()) {
        return;
      }
      await updateDoc(
        doc(db, MysteryCollections.hunterTrails, hunterTrailDoc.id),
        {
          [`interactions.categories.${categoryId}.lastViewed`]:
            serverTimestamp(),
        },
      );

      return { success: true };
    }),

  toggleWatchCategory: privateProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { categoryId } = input;
      const { redis, user } = ctx;
      const categoryRef = doc(db, MysteryCollections.categories, categoryId);
      const hunterTrailsRef = doc(
        db,
        MysteryCollections.hunterTrails,
        user.hunterId,
      );

      await runTransaction(db, async (transaction) => {
        const categoryDoc = await transaction.get(categoryRef);
        const hunterTrailDoc = await transaction.get(hunterTrailsRef);

        if (categoryDoc.exists() && hunterTrailDoc.exists()) {
          const hunterTrailData = hunterTrailDoc.data() as HunterTrail;
          if (
            hunterTrailData.interactions.categories?.[categoryId]?.isBookmarked
          ) {
            transaction.update(categoryRef, {
              bookmarkCount: increment(-1),
            });
            transaction.update(hunterTrailsRef, {
              [`interactions.categories.${categoryId}.isBookmarked`]: false,
            });
            await redis.set(
              `category:bookmark:${user.hunterId}-${categoryId}`,
              "false",
              "EX",
              60 * 60,
            );
          } else {
            transaction.update(categoryRef, {
              bookmarkCount: increment(1),
            });
            transaction.update(hunterTrailsRef, {
              [`interactions.categories.${categoryId}.isBookmarked`]: true,
              [`interactions.categories.${categoryId}.bookmarkedAt`]:
                serverTimestamp(),
            });
            await redis.set(
              `category:bookmark:${user.hunterId}-${categoryId}`,
              "true",
              "EX",
              60 * 60,
            );
          }
        }
      });
      return { success: true };
    }),
});
