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
import GraphemeSplitter from "grapheme-splitter";

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
  const splitter = new GraphemeSplitter();
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
    const graphemes = splitter.splitGraphemes(word);
    for (let i = 1; i <= graphemes.length; i++) {
      nGrams.add(graphemes.slice(0, i).join(""));
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
  const now = Date.now();
  return await Promise.all(
    snapshots.docs.map(async (doc) => {
      const docData = doc.data() as Mystery;
      if (docData.scheduledAt.seconds * 1000 > now) {
        return null;
      }
      let isLiked = false;
      if (mysteryTrails) {
        isLiked = !!mysteryTrails?.[doc.id]?.isLiked;
      } else if (cacheRedis && hunterId) {
        isLiked = await getCachedLike(cacheRedis, hunterId, doc.id);
      }
      const data = parseSnapshotDoc(docData) as Mystery;
      return {
        ...data,
        isLiked,
        id: doc.id,
      } as Mystery;
    }),
  ).then((results) => results.filter((item) => item !== null));
}
