import type { Metadata } from "next";
import { headers } from "next/headers";
import { BonusesContainer } from "@/components/bonuses-container";
import { getSiteBrand, siteBrandDescription } from "@/lib/site-brand";
import { getCanonicalOrigin } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: brand.siteTitle,
    description: siteBrandDescription(brand),
    alternates: { canonical: "/" },
    openGraph: {
      title: brand.siteTitle,
      description: siteBrandDescription(brand),
      url: "/",
    },
  };
}

export default async function Home() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const origin = getCanonicalOrigin(h);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.siteTitle,
    url: origin,
    description: siteBrandDescription(brand),
    publisher: {
      "@type": "Organization",
      name: brand.siteTitle,
      url: origin,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <BonusesContainer />
    </>
  );
}
