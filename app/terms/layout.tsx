import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteBrand } from "@/lib/site-brand";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: "Terms & Conditions",
    description: `Terms of use for ${brand.siteTitle}. General information only—not legal advice.`,
    alternates: { canonical: "/terms" },
    openGraph: {
      title: `Terms & Conditions | ${brand.siteTitle}`,
      url: "/terms",
    },
    twitter: {
      card: "summary_large_image",
      title: `Terms & Conditions | ${brand.siteTitle}`,
    },
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
