type Entry = {
  count: number;
  resetAt: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export type RateLimiter = {
  check: (key: string) => RateLimitDecision;
  clear: () => void;
};

export function createInMemoryRateLimiter(limit: number, windowMs: number): RateLimiter {
  const store = new Map<string, Entry>();

  return {
    check(key: string) {
      const now = Date.now();
      const current = store.get(key);

      if (!current || current.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, limit, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) };
      }

      if (current.count >= limit) {
        return {
          allowed: false,
          limit,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
        };
      }

      current.count += 1;
      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - current.count),
        retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
      };
    },
    clear() {
      store.clear();
    }
  };
}

export const contactRateLimiter = createInMemoryRateLimiter(5, 10 * 60 * 1000);
