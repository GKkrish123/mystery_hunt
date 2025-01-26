/* eslint-disable max-len */
import { onSchedule } from "firebase-functions/scheduler";
import { logger } from "firebase-functions";
import { redis } from "./redis";
import { firestore } from "./firebase-king";
import { FieldValue } from "firebase-admin/firestore";

export const resetRedis = onSchedule("0 8-20/1 * * *", async () => {
  try {
    const timestamp = Date.now();
    const cutoffTime = timestamp - 24 * 60 * 60 * 1000;

    const redisKeyViewCountKeys = await redis.keys("mystery:viewCount:*");
    const redisKeyRecentViews = await redis.keys("mystery:recentViews:*");

    if (
      redisKeyViewCountKeys.length === 0 &&
      redisKeyRecentViews.length === 0
    ) {
      logger.info("No keys found in Redis, skipping processing.");
      return;
    }

    const redisPipeline = redis.pipeline();

    redisKeyViewCountKeys.forEach((key) => {
      redisPipeline.get(key);
    });
    redisKeyRecentViews.forEach((key) => {
      redisPipeline.zcount(key, cutoffTime, timestamp);
    });

    const results = await redisPipeline.exec();

    if (!results || results.length === 0) {
      logger.error(
        "No results found after pipeline execution, So did Nothing!",
      );
      return;
    }

    const viewCounts = results.slice(0, redisKeyViewCountKeys.length);
    const recentViewCounts = results.slice(redisKeyViewCountKeys.length);

    const updates: Record<string, Record<string, unknown>> = {};

    viewCounts.forEach(([err, count], index) => {
      const mysteryId = redisKeyViewCountKeys[index].split(":").pop();
      if (!err && count && mysteryId) {
        const parsedCount = parseInt(count as string, 10);
        if (!isNaN(parsedCount)) {
          updates[mysteryId] = updates[mysteryId] || {};
          updates[mysteryId].viewsCount = FieldValue.increment(parsedCount);
        } else {
          logger.error(
            `Invalid view count for key ${redisKeyViewCountKeys[index]}: ${count}`,
          );
        }
      } else if (err) {
        logger.error(
          `Error retrieving view count for key ${redisKeyViewCountKeys[index]}: ${err}`,
        );
      }
    });

    recentViewCounts.forEach(([err, count], index) => {
      const mysteryId = redisKeyRecentViews[index].split(":").pop();
      if (!err && count && mysteryId) {
        const parsedCount = parseInt(count as string, 10);
        if (!isNaN(parsedCount)) {
          updates[mysteryId] = updates[mysteryId] || {};
          updates[mysteryId].viewsInLast24Hours = parsedCount;
        } else {
          logger.error(
            `Invalid recent view count for key ${redisKeyRecentViews[index]}: ${count}`,
          );
        }
      } else if (err) {
        logger.error(
          `Error retrieving recent view count for key ${redisKeyRecentViews[index]}: ${err}`,
        );
      }
    });

    const batch = firestore.batch();
    let batchHasOperations = false;

    Object.entries(updates).forEach(([mysteryId]) => {
      const docRef = firestore.collection("mysteries").doc(mysteryId);
      batch.set(docRef, updates[mysteryId], { merge: true });
      batchHasOperations = true;
    });

    if (batchHasOperations) {
      await batch.commit();
    } else {
      logger.info("No Firestore updates needed, skipping batch commit.");
    }

    if (redisKeyViewCountKeys.length > 0 || redisKeyRecentViews.length > 0) {
      await redis.del(...redisKeyViewCountKeys, ...redisKeyRecentViews);
    } else {
      logger.info("No keys to delete from redis.");
    }

    logger.info("Redis reset successfully");
    return;
  } catch (error) {
    logger.error("Error in resetRedis function:", error);
    return;
  }
});
