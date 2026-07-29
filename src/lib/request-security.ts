import { timingSafeEqual } from "node:crypto";

export function safeEqualSecret(provided: string, expected: string): boolean {
  const bufferA = Buffer.from(provided);
  const bufferB = Buffer.from(expected);

  return (
    bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
  );
}

function hostsMatch(candidate: string, host: string): boolean {
  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

export function isSameOriginRequest(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return process.env.NODE_ENV !== "production";

  const origin = request.headers.get("origin");
  if (origin) return hostsMatch(origin, host);

  const referer = request.headers.get("referer");
  if (referer) return hostsMatch(referer, host);

  return process.env.NODE_ENV !== "production";
}

export const MAX_JSON_BODY_BYTES = 32_768;

export function isBodyTooLarge(request: Request): boolean {
  const raw = request.headers.get("content-length");
  if (!raw) return false;

  const bytes = Number.parseInt(raw, 10);
  return Number.isFinite(bytes) && bytes > MAX_JSON_BODY_BYTES;
}
