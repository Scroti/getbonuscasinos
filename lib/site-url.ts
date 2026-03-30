/** Normalize origin: no trailing slash. */
function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

type HeaderLike = Pick<Headers, "get">;

/**
 * Build https:// or http:// origin from proxy / edge headers (no env required).
 * Uses x-forwarded-host + x-forwarded-proto when present (typical behind Vercel, CloudFront, etc.).
 */
export function getCanonicalOriginFromHeaders(h: HeaderLike): string | null {
  const hostRaw =
    h.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    h.get("host")?.split(",")[0]?.trim();
  if (!hostRaw) return null;

  const protoRaw = h.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  const proto =
    protoRaw === "http" || protoRaw === "https"
      ? protoRaw
      : hostRaw.startsWith("localhost") ||
          hostRaw.startsWith("127.0.0.1") ||
          hostRaw.includes(".local")
        ? "http"
        : "https";

  return stripTrailingSlash(`${proto}://${hostRaw}`);
}

/**
 * Canonical site origin for metadata, sitemap, robots, JSON-LD.
 *
 * 1. When `headers` is passed (runtime): derive from Host / X-Forwarded-* — no env needed.
 * 2. Otherwise (build/CLI): optional NEXT_PUBLIC_CANONICAL_URL / NEXT_PUBLIC_APP_URL, then VERCEL_URL, then localhost.
 */
export function getCanonicalOrigin(headers?: HeaderLike | null): string {
  if (headers) {
    const fromRequest = getCanonicalOriginFromHeaders(headers);
    if (fromRequest) return fromRequest;
  }

  const raw =
    process.env.NEXT_PUBLIC_CANONICAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) return stripTrailingSlash(raw);
  if (process.env.VERCEL_URL) {
    return stripTrailingSlash(
      `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
    );
  }
  return "http://localhost:3000";
}
