import { MysteryCollections } from "@/server/constants";
import { type HiddenGems } from "@/server/model/hidden-gems";
import { type Hunter, type HunterEssentials } from "@/server/model/hunters";
import { db } from "firebase-user";
import {
  collection,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type QueryConstraint,
  documentId,
  updateDoc,
} from "firebase/firestore";

export function queryHunters(...params: QueryConstraint[]) {
  return query(
    collection(db, MysteryCollections.hunters),
    where("disabled", "==", false),
    where("emailVerified", "==", true),
    ...params,
  );
}

export async function getHunterById(hunterId: string) {
  const hunterDocs = await getDocs(
    queryHunters(where(documentId(), "==", hunterId), limit(1)),
  );
  if (hunterDocs.empty || !hunterDocs.docs[0]) {
    return null;
  }
  return {
    ...hunterDocs.docs[0].data(),
    id: hunterId,
  } as Hunter;
}

export async function getHiddenGemsByUrl(url: string, tool: string) {
  const hiddenGemsSnaps = await getDocs(
    query(
      collection(db, MysteryCollections.hiddenGems),
      where("url", "==", url),
      where("tool", "==", tool),
    ),
  );
  if (hiddenGemsSnaps.empty || !hiddenGemsSnaps.docs[0]) {
    return null;
  }
  return hiddenGemsSnaps.docs.map(
    (hiddenGem) =>
      ({
        ...hiddenGem.data(),
        id: hiddenGem.id,
      }) as HiddenGems,
  );
}

export async function updateToolTrail(
  hunterId: string,
  tool: string,
  time: number,
) {
  await updateDoc(doc(db, MysteryCollections.hunterTrails, hunterId), {
    [`interactions.tools.${tool}`]: time,
  });
}

export function extractHunterEssentials(hunter: Hunter) {
  const {
    email,
    name,
    proPicUrl,
    city,
    country,
    scoreBoard,
    phoneNo,
    dob,
    gender,
    state,
    proPicUpdatedAt,
  } = hunter;
  return {
    email,
    name,
    proPicUrl,
    city,
    country,
    scoreBoard,
    phoneNo,
    dob,
    gender,
    state,
    proPicUpdatedAt,
  } as HunterEssentials;
}

export async function getHunterTrailById(hunterId: string) {
  return await getDoc(doc(db, MysteryCollections.hunterTrails, hunterId));
}

export function parseSnapshotDoc(doc: DocumentData) {
  return JSON.parse(JSON.stringify(doc)) as unknown;
}
