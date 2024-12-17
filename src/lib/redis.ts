import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

redis.on("message", (channel, message) => {
  console.log(`Received message: ${message} from channel: ${channel}`);
});

// Log Redis errors
redis.on("error", (err) => {
  console.error("[Redis] ERROR:", err);
});

export default redis;
