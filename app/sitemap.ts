import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getCanonicalOrigin } from "@/lib/site-url";
import { getCasinosFromFirestore } from "@/lib/firebase/casinos";
import { GUIDE_SLUGS, guideHref } from "@/lib/guides";

export const dynamic = "force-dynamic";

/**
 * Indexable URLs only. Excludes /unsubscribe, /admin, and /api.
 * Casino URLs use Firestore `slug` (see lib/firebase/casinos.ts).
 * Base URL comes from the request Host when possible (no env required).
 * If Firestore is unreachable, only static URLs are returned.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const base = getCanonicalOrigin(h);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/how-we-rate`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.45,
    },
    ...GUIDE_SLUGS.map((slug) => ({
      url: `${base}${guideHref(slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];

  try {
    const casinos = await getCasinosFromFirestore();
    const seen = new Set<string>();
    const casinoEntries: MetadataRoute.Sitemap = [];

    for (const c of casinos) {
      const slug = (c.slug || "").trim();
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      casinoEntries.push({
        url: `${base}/casino/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    return [...staticEntries, ...casinoEntries];
  } catch {
    return staticEntries;
  }
}
