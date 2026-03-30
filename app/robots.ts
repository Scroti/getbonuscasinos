import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getCanonicalOrigin } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/**
 * Public HTML lives at /, /contact, /casino/*. Admin and API are disallowed.
 * /unsubscribe stays crawlable but uses robots noindex in app/unsubscribe/layout.tsx.
 * Origin is taken from the request Host when possible (no env required).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const base = getCanonicalOrigin(h);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  };
}
