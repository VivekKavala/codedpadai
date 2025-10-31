// lib/utils/rateLimiter.ts

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production for multiple server instances)
const resetRequestStore = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if a user/IP has exceeded rate limit for password reset
 */
export function checkResetRateLimit(identifier: string): {
  allowed: boolean;
  resetAt?: Date;
} {
  const now = Date.now();
  const entry = resetRequestStore.get(identifier);

  // Clean up expired entries
  if (entry && entry.resetAt < now) {
    resetRequestStore.delete(identifier);
  }

  const currentEntry = resetRequestStore.get(identifier);

  if (!currentEntry) {
    // First request in window
    resetRequestStore.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true };
  }

  if (currentEntry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      resetAt: new Date(currentEntry.resetAt),
    };
  }

  // Increment count
  currentEntry.count += 1;
  resetRequestStore.set(identifier, currentEntry);

  return { allowed: true };
}

/**
 * Clean up old entries (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of resetRequestStore.entries()) {
    if (entry.resetAt < now) {
      resetRequestStore.delete(key);
    }
  }
}

// Clean up every 10 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}
