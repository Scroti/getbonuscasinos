import type { Metadata } from "next";
import { headers } from "next/headers";
import { BonusesContainer } from "@/components/bonuses-container";
import { getHomeFaqItems } from "@/lib/home-faq";
import { getSiteBrand, siteBrandDescription } from "@/lib/site-brand";
import { getCanonicalOrigin } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const origin = getCanonicalOrigin(h);

  const currentYear = new Date().getFullYear();
  const title = `Compare Casino Bonuses & Welcome Offers ${currentYear} | ${brand.siteTitle}`;
  const description = siteBrandDescription(brand);
  const ogImageUrl = `${origin}/og-image.png`;

  return {
    title,
    description,
    keywords: [
      "casino bonuses",
      "best casino welcome bonus",
      "no deposit bonus codes",
      "low wagering casino bonuses",
      "online casino offers",
      "welcome bonus",
      "casino promotions",
      "wagering requirements",
      "compare casino offers",
      "exclusive casino offers",
      "free spins",
      "match bonus",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      locale: "en",
      siteName: brand.siteTitle,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${brand.siteTitle} — compare casino bonuses`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Home() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const origin = getCanonicalOrigin(h);

  const desc = siteBrandDescription(brand);
  const faqItems = getHomeFaqItems(brand.siteTitle);
  const currentYear = new Date().getFullYear();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: brand.siteTitle,
        url: origin,
        logo: {
          "@type": "ImageObject",
          url: `${origin}/og-image.png`,
          width: 1200,
          height: 630,
        },
        description: desc,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: brand.siteTitle,
        url: origin,
        description: desc,
        publisher: { "@id": `${origin}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${origin}/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${origin}/#webpage`,
        url: origin,
        name: `Compare Casino Bonuses & Welcome Offers ${currentYear} | ${brand.siteTitle}`,
        description: desc,
        isPartOf: { "@id": `${origin}/#website` },
        publisher: { "@id": `${origin}/#organization` },
        dateModified: new Date().toISOString().split("T")[0],
        about: {
          "@type": "Thing",
          name: "Casino bonus comparisons",
          description:
            "Editorial summaries of third-party gambling promotions; the publisher is not a casino operator.",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: origin,
            },
          ],
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
      {/* Visually hidden H1 ensures search engines always see the primary heading
          regardless of client-side loading state in BonusesContainer */}
      <h1 className="sr-only">Compare the Best Casino Bonuses &amp; Welcome Offers</h1>
      <BonusesContainer />
    </>
  );
}
