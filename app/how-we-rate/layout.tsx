import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteBrand } from "@/lib/site-brand";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: "How we list offers",
    description: `Editorial approach for casino listings and bonuses on ${brand.siteTitle}. Independent publisher; offers change—confirm on each operator site.`,
    alternates: { canonical: "/how-we-rate" },
    openGraph: {
      title: `How we list offers | ${brand.siteTitle}`,
      url: "/how-we-rate",
    },
    twitter: {
      card: "summary_large_image",
      title: `How we list offers | ${brand.siteTitle}`,
    },
  };
}

export default function HowWeRateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
