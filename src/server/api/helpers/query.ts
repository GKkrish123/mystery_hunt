import { MysteryCollections } from "@/server/constants";
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
