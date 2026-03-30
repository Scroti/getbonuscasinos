import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSiteBrand } from "@/lib/site-brand";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));

  return {
    title: "Contact",
    description: `Contact ${brand.siteTitle} about bonuses, corrections, or partnerships.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `Contact | ${brand.siteTitle}`,
      description: `Get in touch with ${brand.siteTitle}.`,
      url: "/contact",
    },
    twitter: {
      card: "summary_large_image",
      title: `Contact | ${brand.siteTitle}`,
      description: `Get in touch with ${brand.siteTitle}.`,
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
