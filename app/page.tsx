import type { Metadata } from "next";
import { headers } from "next/headers";
import { BonusesContainer } from "@/components/bonuses-container";
import { getSiteBrand, siteBrandDescription } from "@/lib/site-brand";
import { getCanonicalOrigin } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: `${brand.siteTitle} — casino bonuses & operator offers`,
    description: siteBrandDescription(brand),
    alternates: { canonical: "/" },
    openGraph: {
      title: `${brand.siteTitle} — casino bonuses & operator offers`,
      description: siteBrandDescription(brand),
      url: "/",
    },
  };
}

export default async function Home() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const origin = getCanonicalOrigin(h);

  const desc = siteBrandDescription(brand);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: brand.siteTitle,
        url: origin,
        description: desc,
        publisher: {
          "@type": "Organization",
          name: brand.siteTitle,
          url: origin,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${origin}/#webpage`,
        url: origin,
        name: `${brand.siteTitle} — casino bonuses & operator offers`,
        description: desc,
        isPartOf: { "@id": `${origin}/#website` },
        about: {
          "@type": "Thing",
          name: "Casino bonus comparisons",
          description:
            "Editorial summaries of third-party gambling promotions; the publisher is not a casino operator.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BonusesContainer />
    </>
  );
}
