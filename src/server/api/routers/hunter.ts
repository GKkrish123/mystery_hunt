import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "firebase-user";
import {
  feedbackAddCooldown,
  MysteryCollections,
  proPicUpdateCooldown,
  type State,
} from "@/server/constants";
import { type HunterTrail } from "@/server/model/hunter-trails";
import { chunkArray } from "@/lib/utils";
import { firebaseAdminApp } from "firebase-king";
import { google } from "googleapis";
import {
  findDuplicateHunter,
  getHuntersRankList,
  uploadProPicUrl,
} from "../helpers/hunter";
import {
  extractHunterEssentials,
  getHunterById,
  getHunterTrailById,
  queryHunters,
} from "../helpers/query";
import { fetchMysteriesByIdChunks } from "../helpers/mystery";
import { fetchCategoriesByIdChunks } from "../helpers/category";

export const userRouter = createTRPCRouter({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const hunterDoc = await getHunterById(ctx.user.hunterId);
    if (!hunterDoc) {
      throw new Error("User not found", {
        cause: "user-not-found",
      });
    }
    return extractHunterEssentials(hunterDoc);
  }),

  setUserName: privateProcedure
    .input(z.object({ name: z.string().min(3).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const hunterDoc = await getHunterById(ctx.user.hunterId);
      if (!hunterDoc) {
        throw new Error("User not found", {
          cause: "user-not-found",
        });
      }
      if (hunterDoc.name !== name) {
        await setDoc(
          doc(db, MysteryCollections.hunters, ctx.user.hunterId),
          {
            name,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
      return { success: true };
    }),

  setProfilePic: privateProcedure
    .input(z.object({ profilePic: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { profilePic } = input;
      const hunterDoc = await getHunterById(ctx.user.hunterId);
      if (!hunterDoc) {
        throw new Error("User not found", {
          cause: "user-not-found",
        });
      }
      const now = Date.now();
      if (
        hunterDoc.proPicUpdatedAt &&
        now - hunterDoc.proPicUpdatedAt < proPicUpdateCooldown
      ) {
        throw new Error("Profile picture update cooldown", {
          cause: "pro-pic-update-cooldown",
        });
      }
      const proPicPublicUrl = await uploadProPicUrl(
        profilePic,
        ctx.user.hunterId,
        now,
        hunterDoc.proPicUpdatedAt,
      );
      await setDoc(
        doc(db, MysteryCollections.hunters, ctx.user.hunterId),
        {
          proPicUrl: proPicPublicUrl,
          proPicUpdatedAt: now,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      return { success: true };
    }),

  addFeedback: privateProcedure
    .input(z.object({ feedback: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { feedback } = input;
      const hunterTrailsSnapshot = await getHunterTrailById(ctx.user.hunterId);
      const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;

      const now = Date.now();
      if (
        hunterTrailsData.lastFeedbackAt &&
        now - hunterTrailsData.lastFeedbackAt < feedbackAddCooldown
      ) {
        console.error("Feedback addition isn't cooled down");
        return { success: false };
      }
      await setDoc(
        doc(db, MysteryCollections.hunterTrails, ctx.user.hunterId),
        {
          feedbacks: arrayUnion({
            text: feedback,
            at: new Date(now).toLocaleString(),
          }),
          lastFeedbackAt: now,
        },
        { merge: true },
      );
      return { success: true };
    }),

  isFeedbackValid: privateProcedure.query(async ({ ctx }) => {
    const hunterTrailsSnapshot = await getHunterTrailById(ctx.user.hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;

    const now = Date.now();
    if (
      hunterTrailsData.lastFeedbackAt &&
      now - hunterTrailsData.lastFeedbackAt < feedbackAddCooldown
    ) {
      return { success: false };
    }
    return { success: true };
  }),

  getFavourites: privateProcedure.query(async ({ ctx }) => {
    const hunterTrailsSnapshot = await getHunterTrailById(ctx.user.hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;

    const likedMysteries = hunterTrailsData?.interactions?.mysteries || {};
    const bookmarkedCategories =
      hunterTrailsData?.interactions?.categories || {};

    const likedMysteryIds = Object.keys(likedMysteries).filter(
      (id) => likedMysteries[id]?.isLiked,
    );
    const bookmarkedCategoryIds = Object.keys(bookmarkedCategories).filter(
      (id) => bookmarkedCategories[id]?.isBookmarked,
    );

    const mysteryChunks = chunkArray(likedMysteryIds, 10);
    const categoryChunks = chunkArray(bookmarkedCategoryIds, 10);

    const mysteriesPromises = fetchMysteriesByIdChunks(
      mysteryChunks,
      hunterTrailsData?.interactions?.mysteries,
    );
    const categoriesPromises = fetchCategoriesByIdChunks(
      categoryChunks,
      hunterTrailsData?.interactions?.categories,
    );

    const [mysterySnapshots, categorySnapshots] = await Promise.all([
      Promise.all(mysteriesPromises),
      Promise.all(categoriesPromises),
    ]);

    const mysteries = mysterySnapshots.flat();
    const categories = categorySnapshots.flat();

    mysteries.sort(
      (a, b) =>
        likedMysteries[b.id]!.likedAt!.toMillis() -
        likedMysteries[a.id]!.likedAt!.toMillis(),
    );
    categories.sort(
      (a, b) =>
        bookmarkedCategories[b.id]!.bookmarkedAt!.toMillis() -
        bookmarkedCategories[a.id]!.bookmarkedAt!.toMillis(),
    );

    return {
      likedMysteries: mysteries,
      bookmarkedCategories: categories,
    };
  }),

  getLeaderboards: privateProcedure
    .input(
      z.object({
        state: z.string().optional(),
        city: z.string().optional(),
        event: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { state, city, event } = input;
      const scoreAlias = event
        ? `scoreBoard.eventScores.${event}`
        : "scoreBoard.totalScore";
      const lastScoredAlias = event
        ? `scoreBoard.eventsLastScoredAt.${event}`
        : "scoreBoard.lastScoredAt";
      let queryRef = queryHunters();
      queryRef = query(queryRef, where(scoreAlias, ">", 0));
      if (state) {
        queryRef = query(queryRef, where("state", "==", state));
      }
      if (city) {
        queryRef = query(queryRef, where("city", "==", city));
      }
      queryRef = query(
        queryRef,
        orderBy(scoreAlias, "desc"),
        orderBy(lastScoredAlias, "asc"),
      );
      queryRef = query(queryRef, limit(state || city || event ? 50 : 100));
      const querySnapshot = await getDocs(queryRef);
      const hunters = getHuntersRankList(querySnapshot, event);
      return hunters;
    }),

  getCountryStates: publicProcedure
    .input(z.object({ country: z.string().optional() }))
    .query(async ({ input }) => {
      const { country } = input;
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        },
      );

      const data = (await response.json()) as unknown as {
        data: { states: State[] };
      };
      return data.data.states;
    }),

  getStateCities: publicProcedure
    .input(z.object({ country: z.string().optional(), state: z.string() }))
    .query(async ({ input }) => {
      const { country = "India", state } = input;
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, state }),
        },
      );
      const data = (await response.json()) as unknown as {
        data: string[];
      };
      return data.data;
    }),

  createUser: publicProcedure
    .input(
      z
        .object({
          password: z
            .string()
            .min(1)
            .refine((password) => password.length >= 8)
            .refine((password) => /[A-Z]/.test(password))
            .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password))
            .refine((password) => /\d/.test(password)),
          confirmPassword: z
            .string()
            .min(1)
            .refine((confirmPassword) => confirmPassword.length >= 8)
            .refine((confirmPassword) => /[A-Z]/.test(confirmPassword))
            .refine((confirmPassword) =>
              /[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword),
            )
            .refine((confirmPassword) => /\d/.test(confirmPassword)),
          country: z.string().min(1),
          city: z.string().min(1),
          dob: z.date(),
          email: z.string().min(1).email(),
          gender: z.string().min(1),
          name: z.string().min(3).max(50),
          phoneNo: z.string().min(1),
          profilePic: z.string().min(1),
          state: z.string().min(1),
          verificationCode: z.string().min(1),
          verificationId: z.string().min(1),
        })
        .refine((input) => input.password === input.confirmPassword),
    )
    .mutation(async ({ input }) => {
      try {
        const { email, password, phoneNo, verificationCode, verificationId } =
          input;
        await findDuplicateHunter(email, phoneNo);
        const existingDisabledHunter = await getDocs(
          query(
            collection(db, MysteryCollections.hunters),
            where("email", "==", email),
            where("phoneNo", "==", phoneNo),
            where("disabled", "==", true),
          ),
        );
        let newHunterDoc;
        if (existingDisabledHunter.empty || !existingDisabledHunter.docs[0]) {
          newHunterDoc = await addDoc(
            collection(db, MysteryCollections.hunters),
            {
              city: input.city,
              country: input.country,
              dob: input.dob,
              email: input.email,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              disabled: true,
              gender: input.gender,
              name: input.name,
              phoneNo: input.phoneNo,
              state: input.state,
              scoreBoard: {
                totalScore: 0,
                lastScoredAt: serverTimestamp(),
                eventScores: {},
                eventsLastScoredAt: {},
              },
              proPicUrl: "",
              userId: "",
            },
          );
        } else {
          newHunterDoc = existingDisabledHunter.docs[0];
          await setDoc(
            doc(
              db,
              MysteryCollections.hunters,
              existingDisabledHunter.docs[0].id,
            ),
            {
              city: input.city,
              country: input.country,
              dob: input.dob,
              email: input.email,
              updatedAt: serverTimestamp(),
              disabled: true,
              gender: input.gender,
              name: input.name,
              phoneNo: input.phoneNo,
              state: input.state,
              scoreBoard: {
                totalScore: 0,
                lastScoredAt: serverTimestamp(),
                eventScores: {},
                eventsLastScoredAt: {},
              },
              proPicUrl: "",
              userId: "",
            },
            { merge: true },
          );
        }

        const now = Date.now();
        const proPicPublicUrl = await uploadProPicUrl(
          input.profilePic,
          newHunterDoc.id,
          now,
        );

        const identityToolkit = google.identitytoolkit({
          auth: auth.config.apiKey,
          version: "v3",
        });
        const verifyPhoneNumber =
          await identityToolkit.relyingparty.verifyPhoneNumber({
            requestBody: {
              phoneNumber: phoneNo,
              code: verificationCode,
              sessionInfo: verificationId,
            },
          });
        if (verifyPhoneNumber.status !== 200) {
          throw new Error("Phone number verification failed", {
            cause: "phone-verification-failed",
          });
        }
        const adminAuth = firebaseAdminApp.auth();
        const updatedUser = await adminAuth.updateUser(
          verifyPhoneNumber.data.localId!,
          {
            email,
            password,
            emailVerified: false,
            displayName: null,
          },
        );
        await setDoc(
          doc(db, MysteryCollections.hunters, newHunterDoc.id),
          {
            userId: updatedUser.uid,
            proPicUrl: proPicPublicUrl,
            proPicUpdatedAt: now,
            updatedAt: serverTimestamp(),
            emailVerified: false,
          },
          { merge: true },
        );
        return { success: true };
      } catch (error: unknown) {
        const err = error as Error;
        console.error(`Error creating user - ${JSON.stringify(err)}`);
        return { success: false, error };
      }
    }),

  isAnyDuplicateUser: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).email(),
        phoneNo: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, phoneNo } = input;
      await findDuplicateHunter(email, phoneNo);
      return { success: true, isDuplicate: false };
    }),

  verifiedUser: publicProcedure.mutation(async ({ ctx }) => {
    const adminAuth = firebaseAdminApp.auth();
    const userData = await adminAuth.getUser(ctx.user.uid);
    if (!userData.emailVerified) {
      throw new Error("User email not verified", {
        cause: "email-not-verified",
      });
    }
    const newHunterDocs = await getDocs(
      query(
        collection(db, MysteryCollections.hunters),
        where("userId", "==", ctx.user.uid),
        where("disabled", "==", true),
        where("emailVerified", "==", false),
        limit(1),
      ),
    );
    if (newHunterDocs.empty || !newHunterDocs.docs[0]) {
      throw new Error("User document not found", {
        cause: "user-document-not-found",
      });
    }
    const newHunterDoc = newHunterDocs.docs[0];
    const hunterTrailDoc = doc(
      db,
      MysteryCollections.hunterTrails,
      newHunterDoc.id,
    );

    await runTransaction(db, async (transaction) => {
      transaction.update(newHunterDoc.ref, {
        disabled: false,
        emailVerified: true,
      });
      transaction.set(hunterTrailDoc, {
        interactions: {
          categories: {},
          mysteries: {},
          tools: {},
        },
        trails: [],
      });
    });
    await adminAuth.updateUser(ctx.user.uid, {
      displayName: newHunterDoc.id,
    });
    return { success: true };
  }),
});
