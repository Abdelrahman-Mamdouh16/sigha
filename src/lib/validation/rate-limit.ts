import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

const hits = new Map<string, { count: number; resetAt: number }>();

// Basic cleanup so the map doesn't grow unbounded on a long-lived instance.
function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt < now) hits.delete(key);
  }
}

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  sweep(now);

  const entry = hits.get(identifier);
  if (!entry || entry.resetAt < now) {
    hits.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}
