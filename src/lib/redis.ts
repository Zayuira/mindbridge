import Redis from 'ioredis';

const redisClient = () => {
  const options = {
    maxRetriesPerRequest: 1,
    connectTimeout: 1000, // 1 секундын дараа бууж өгнө
    retryStrategy: () => null // Дахин холбогдох гэж оролдохгүй
  };

  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, options);
  }
  
  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    ...options
  });
};

const redis = redisClient();

/**
 * Cache-Aside pattern: Redis-с авах, байхгүй бол DB-с авч cache-д хадгална
 * @param key - Redis key
 * @param ttl - Cache хугацаа (секундээр)
 * @param fetcher - DB query функц
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
  } catch {
    // Redis холболт амжилтгүй бол DB руу шууд очно
  }

  const freshData = await fetcher();

  try {
    await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
  } catch {
    // Cache хадгалж чадаагүй ч ажиллагаа зогсохгүй
  }

  return freshData;
}

/**
 * Тодорхой pattern-д тохирох бүх cache key-г устгана
 * ✅ #3.1 KEYS → SCAN: production-д KEYS blocking байдаг тул SCAN ашиглана
 * Жишээ: invalidateCache('jobs:*') → бүх job cache устана
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch {
    // Redis алдаа гарсан ч app зогсохгүй
  }
}

/**
 * Нэг key-г устгана
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // ignore
  }
}

export default redis;
