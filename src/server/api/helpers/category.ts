import {
  collection,
  type DocumentData,
  documentId,
  getDocs,
  query,
  type QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "firebase-user";
import { MysteryCollections } from "@/server/constants";
import { type Category } from "@/server/model/categories";
import { parseSnapshotDoc } from "./query";
import type Redis from "ioredis";
import { type CategoryInteraction } from "@/server/model/hunter-trails";
import { getCachedBookmark } from "./hunter";

export function fetchCategoriesByIdChunks(
  idChunks: string[][],
  categoryTrails: Record<string, CategoryInteraction>,
) {
  const categoriesCollection = collection(db, MysteryCollections.categories);

  const categoryPromises = idChunks.map(async (chunk) => {
    const q = query(categoriesCollection, where(documentId(), "in", chunk));
    const querySnapshot = await getDocs(q);
    return await snapshotsToCategories(
      querySnapshot,
      undefined,
      undefined,
      categoryTrails,
    );
  });
  return categoryPromises;
}

export async function snapshotsToCategories(
  snapshots: QuerySnapshot<DocumentData, DocumentData>,
  cacheRedis?: Redis,
  hunterId?: string,
  categoryTrails?: Record<string, CategoryInteraction>,
) {
  const now = Date.now();
  return await Promise.all(
    snapshots.docs.map(async (doc) => {
      const docData = doc.data() as Category;
      if (docData.scheduledAt.seconds * 1000 > now) {
        return null;
      }
      let isBookmarked = false;
      if (categoryTrails) {
        isBookmarked = !!categoryTrails?.[doc.id]?.isBookmarked;
      } else if (cacheRedis && hunterId) {
        isBookmarked = await getCachedBookmark(cacheRedis, hunterId, doc.id);
      }
      const data = parseSnapshotDoc(docData) as Category;
      return {
        ...data,
        isBookmarked,
        id: doc.id,
      } as Category;
    }),
  ).then((results) => results.filter((item) => item !== null));
}
