import type { Metadata } from "next";
import { headers } from "next/headers";
import { BonusesContainer } from "@/components/bonuses-container";
import { getHomeFaqItems } from "@/lib/home-faq";
import { getSiteBrand, siteBrandDescription } from "@/lib/site-brand";
import { getCanonicalOrigin } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  const title = `${brand.siteTitle} — casino bonuses & welcome offers`;
  const description = siteBrandDescription(brand);

  return {
    title,
    description,
    keywords: [
      "casino bonuses",
      "online casino offers",
      "welcome bonus",
      "casino promotions",
      "wagering requirements",
      "compare casino offers",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      locale: "en",
      siteName: brand.siteTitle,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Home() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const origin = getCanonicalOrigin(h);

  const desc = siteBrandDescription(brand);
  const faqItems = getHomeFaqItems(brand.siteTitle);
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
      {
        "@type": "FAQPage",
        "@id": `${origin}/#faq`,
        url: origin,
        isPartOf: { "@id": `${origin}/#webpage` },
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
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
