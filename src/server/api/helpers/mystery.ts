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
import { type Mystery } from "@/server/model/mysteries";
import { MysteryCollections } from "@/server/constants";
import { parseSnapshotDoc } from "./query";
import type Redis from "ioredis";
import { getCachedLike } from "./hunter";
import { type MysteryInteraction } from "@/server/model/hunter-trails";

export function fetchMysteriesByIdChunks(
  idChunks: string[][],
  mysteryTrails: Record<string, MysteryInteraction>,
) {
  const mysteriesCollection = collection(db, MysteryCollections.mysteries);

  const mysteriesPromises = idChunks.map(async (chunk) => {
    const q = query(mysteriesCollection, where(documentId(), "in", chunk));
    const querySnapshot = await getDocs(q);
    return await snapshotsToMysteries(
      querySnapshot,
      undefined,
      undefined,
      mysteryTrails,
    );
  });

  return mysteriesPromises;
}

export function generateNGrams(text: string): string[] {
  const words = text.toLowerCase().split(" ");
  const nGrams = new Set<string>();

  for (let i = 0; i < words.length; i++) {
    let phrase = "";
    for (let j = i; j < words.length; j++) {
      phrase = phrase ? `${phrase} ${words[j]}` : words[j]!;
      nGrams.add(phrase);
    }
  }

  words.forEach((word) => {
    for (let i = 1; i <= word.length; i++) {
      nGrams.add(word.substring(0, i));
    }
  });

  return Array.from(nGrams);
}

export async function snapshotsToMysteries(
  snapshots: QuerySnapshot<DocumentData, DocumentData>,
  cacheRedis?: Redis,
  hunterId?: string,
  mysteryTrails?: Record<string, MysteryInteraction>,
) {
  return await Promise.all(
    snapshots.docs.map(async (doc) => {
      let isLiked = false;
      if (mysteryTrails) {
        isLiked = !!mysteryTrails?.[doc.id]?.isLiked;
      } else if (cacheRedis && hunterId) {
        isLiked = await getCachedLike(cacheRedis, hunterId, doc.id);
      }
      const data = parseSnapshotDoc(doc.data()) as Mystery;
      return {
        ...data,
        isLiked,
        id: doc.id,
      } as Mystery;
    }),
  );
}
