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

    const redisMysteryViewCountKeys = await redis.keys("mystery:viewCount:*");
    const redisCategoryViewCountKeys = await redis.keys("category:viewCount:*");
    const redisKeyRecentViews = await redis.keys("mystery:recentViews:*");

    if (
      redisMysteryViewCountKeys.length === 0 &&
      redisCategoryViewCountKeys.length === 0 &&
      redisKeyRecentViews.length === 0
    ) {
      logger.info("No keys found in Redis, skipping processing.");
      return;
    }

    const redisPipeline = redis.pipeline();

    [...redisMysteryViewCountKeys, ...redisCategoryViewCountKeys].forEach(
      (key) => {
        redisPipeline.get(key);
      },
    );
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

    const mysteryViewCounts = results.slice(
      0,
      redisMysteryViewCountKeys.length,
    );
    const categoryViewCounts = results.slice(
      redisMysteryViewCountKeys.length,
      redisCategoryViewCountKeys.length,
    );
    const recentViewCounts = results.slice(
      redisMysteryViewCountKeys.length + redisCategoryViewCountKeys.length,
    );

    const updates: Record<string, Record<string, unknown>> = {};
    const categoryUpdates: Record<string, Record<string, unknown>> = {};

    mysteryViewCounts.forEach(([err, count], index) => {
      const mysteryId = redisMysteryViewCountKeys[index].split(":").pop();
      if (!err && count && mysteryId) {
        const parsedCount = parseInt(count as string, 10);
        if (!isNaN(parsedCount)) {
          updates[mysteryId] = updates[mysteryId] || {};
          updates[mysteryId].viewsCount = FieldValue.increment(parsedCount);
        } else {
          logger.error(
            `Invalid mystery view count for key ${redisMysteryViewCountKeys[index]}: ${count}`,
          );
        }
      } else if (err) {
        logger.error(
          `Error retrieving mystery view count for key ${redisMysteryViewCountKeys[index]}: ${err}`,
        );
      }
    });

    categoryViewCounts.forEach(([err, count], index) => {
      const categoryId = redisCategoryViewCountKeys[index].split(":").pop();
      if (!err && count && categoryId) {
        const parsedCount = parseInt(count as string, 10);
        if (!isNaN(parsedCount)) {
          categoryUpdates[categoryId] = categoryUpdates[categoryId] || {};
          categoryUpdates[categoryId].viewsCount =
            FieldValue.increment(parsedCount);
        } else {
          logger.error(
            `Invalid category view count for key ${redisCategoryViewCountKeys[index]}: ${count}`,
          );
        }
      } else if (err) {
        logger.error(
          `Error retrieving category view count for key ${redisCategoryViewCountKeys[index]}: ${err}`,
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

    Object.entries(categoryUpdates).forEach(([categoryId]) => {
      const docRef = firestore.collection("categories").doc(categoryId);
      batch.set(docRef, categoryUpdates[categoryId], { merge: true });
      batchHasOperations = true;
    });

    if (batchHasOperations) {
      await batch.commit();
    } else {
      logger.info("No Firestore updates needed, skipping batch commit.");
    }

    if (
      redisMysteryViewCountKeys.length > 0 ||
      redisCategoryViewCountKeys.length > 0 ||
      redisKeyRecentViews.length > 0
    ) {
      await redis.del(
        ...redisMysteryViewCountKeys,
        ...redisCategoryViewCountKeys,
        ...redisKeyRecentViews,
      );
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
