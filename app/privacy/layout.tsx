import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteBrand } from "@/lib/site-brand";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: "Privacy Policy",
    description: `How ${brand.siteTitle} collects, uses, and protects your information.`,
    alternates: { canonical: "/privacy" },
    openGraph: {
      title: `Privacy Policy | ${brand.siteTitle}`,
      url: "/privacy",
    },
    twitter: {
      card: "summary_large_image",
      title: `Privacy Policy | ${brand.siteTitle}`,
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
