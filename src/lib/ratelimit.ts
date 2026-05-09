import redis from './redis';

/**
 * Simple Fixed Window Rate Limiting using Redis
 * @param identifier - Unique ID (e.g., IP address or User ID)
 * @param limit - Max requests allowed in the window
 * @param windowSeconds - Time window in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
) {
  const key = `ratelimit:${identifier}`;

  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
      success: current <= limit,
      current,
      limit,
      remaining: Math.max(0, limit - current),
      reset: ttl > 0 ? ttl : windowSeconds
    };
  } catch (error) {
    // If Redis fails, we allow the request but log the error
    console.error('Rate limit Redis error:', error);
    return {
      success: true,
      current: 0,
      limit,
      remaining: limit,
      reset: 0
    };
  }
}
