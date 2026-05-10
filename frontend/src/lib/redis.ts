import Redis from "ioredis";

// Redis client үүсгэх
const redisClient = () => {
  const options = {
    maxRetriesPerRequest: 1,
    connectTimeout: 1000,
    retryStrategy: () => null, // дахин reconnect хийхгүй
  };

  // ✅ Upstash / production
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, options);
  }

  // ✅ Local redis fallback
  return new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    ...options,
  });
};

const redis = redisClient();

// Optional logs
redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

/**
 * Cache-Aside pattern
 * Redis-с уншина → байхгүй бол DB query хийнэ → cache-д хадгална
 */
export async function getOrSetCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.error("Redis GET error:", err);
  }

  // DB query
  const freshData = await fetcher();

  try {
    await redis.set(key, JSON.stringify(freshData), "EX", ttl);
  } catch (err) {
    console.error("Redis SET error:", err);
  }

  return freshData;
}

/**
 * Pattern matching cache устгах
 * KEYS биш SCAN ашиглаж байгаа нь production-safe
 *
 * Example:
 * invalidateCache("jobs:*")
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    console.error("Redis invalidate error:", err);
  }
}

/**
 * Single cache key устгах
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    console.error("Redis delete error:", err);
  }
}

export default redis;