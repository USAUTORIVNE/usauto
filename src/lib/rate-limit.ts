type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  {
    limit = 8,
    windowMs = 60_000,
  }: {
    limit?: number;
    windowMs?: number;
  } = {},
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true };
}

export function getClientIp(request: Request): string {
  return getIpFromHeaderValues(
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
  );
}

export function getIpFromHeaderValues(
  forwarded: string | null,
  realIp: string | null,
): string {
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return realIp ?? "unknown";
}
