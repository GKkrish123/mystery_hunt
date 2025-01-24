import {
  type DocumentData,
  getDocs,
  type QuerySnapshot,
  where,
} from "firebase/firestore";
import { getHunterTrailById, parseSnapshotDoc, queryHunters } from "./query";
import { type Hunter, type HunterRank } from "@/server/model/hunters";
import { firebaseAdminApp } from "firebase-king";
import type Redis from "ioredis";
import { type HunterTrail } from "@/server/model/hunter-trails";

export async function findDuplicateHunter(email: string, phoneNo: string) {
  const phoneQuery = queryHunters(where("phoneNo", "==", phoneNo));
  const phoneQuerySnapshot = await getDocs(phoneQuery);
  if (!phoneQuerySnapshot.empty) {
    throw Object.assign(new Error("Phone number already in use"), {
      cause: "phone-already-in-use",
    });
  }
  const emailQuery = queryHunters(where("email", "==", email));
  const emailQuerySnapshot = await getDocs(emailQuery);
  if (!emailQuerySnapshot.empty) {
    throw Object.assign(new Error("Email already in use"), {
      cause: "email-already-in-use",
    });
  }
}

export function getHuntersRankList(
  huntersSnapshot: QuerySnapshot<DocumentData, DocumentData>,
  event?: string,
) {
  return huntersSnapshot.docs.map((doc, index) => {
    const data = parseSnapshotDoc(doc.data()) as Hunter;
    return {
      city: data.city,
      country: data.country,
      name: data.name,
      proPicUrl: data.proPicUrl,
      rank: index + 1,
      score: event
        ? (data.scoreBoard.eventScores?.[event] ?? 0)
        : data.scoreBoard.totalScore,
      state: data.state,
    } as HunterRank;
  });
}

export async function uploadProPicUrl(
  profilePic: string,
  hunterId: string,
  dateTimestamp: number,
  deletePicTimestamp?: number,
) {
  const buffer = Buffer.from(profilePic?.split(",")?.[1] ?? "", "base64");
  const maxSizeInBytes = 300 * 1024;
  if (buffer.length > maxSizeInBytes) {
    throw new Error("File size exceeds 300 KB limit.", {
      cause: "file-size-exceeds-limit",
    });
  }

  const storage = firebaseAdminApp.storage();
  const bucket = storage.bucket("gkrish-mystery-hunt.firebasestorage.app");
  if (deletePicTimestamp) {
    const deleteFileName = `profile-pictures/${hunterId}-${deletePicTimestamp}.jpeg`;
    const deleteFile = bucket.file(deleteFileName);
    await deleteFile.delete({
      ignoreNotFound: true,
    });
  }
  const fileName = `profile-pictures/${hunterId}-${dateTimestamp}.jpeg`;
  const file = bucket.file(fileName);
  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  await file.makePublic();
  return file.publicUrl();
}

export async function getCachedLike(
  redis: Redis,
  hunterId: string,
  mysteryId: string,
) {
  let cachedLike = await redis.get(`mystery:like:${hunterId}-${mysteryId}`);
  if (!cachedLike) {
    const hunterTrailsSnapshot = await getHunterTrailById(hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;
    cachedLike = hunterTrailsData?.interactions?.mysteries?.[mysteryId]?.isLiked
      ? "true"
      : "false";
  }
  return cachedLike === "true";
}

export async function getCachedBookmark(
  redis: Redis,
  hunterId: string,
  categoryId: string,
) {
  let cachedBookmark = await redis.get(
    `category:bookmark:${hunterId}-${categoryId}`,
  );
  if (!cachedBookmark) {
    const hunterTrailsSnapshot = await getHunterTrailById(hunterId);
    const hunterTrailsData = hunterTrailsSnapshot.data() as HunterTrail;
    cachedBookmark = hunterTrailsData?.interactions?.categories?.[categoryId]
      ?.isBookmarked
      ? "true"
      : "false";
  }
  return cachedBookmark === "true";
}
