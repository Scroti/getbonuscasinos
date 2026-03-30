import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { LegalDocumentShell } from "@/components/legal-document-shell";
import { GUIDE_SLUGS, guideHref, type GuideSlug } from "@/lib/guides";
import { GUIDE_CONTENT } from "@/lib/guides-data";
import { getSiteBrand } from "@/lib/site-brand";

const LINK =
  "text-primary font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline-offset-4 hover:underline";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  if (!GUIDE_SLUGS.includes(raw as GuideSlug)) {
    return { title: "Not found" };
  }
  const slug = raw as GuideSlug;
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const g = GUIDE_CONTENT[slug];
  const path = guideHref(slug);

  return {
    title: `${g.titleLine} ${g.titleGradient}`.trim(),
    description: g.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${g.titleLine} ${g.titleGradient} | ${brand.siteTitle}`,
      description: g.metaDescription,
      url: path,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug: raw } = await params;
  if (!GUIDE_SLUGS.includes(raw as GuideSlug)) {
    notFound();
  }
  const slug = raw as GuideSlug;
  const g = GUIDE_CONTENT[slug];

  return (
    <LegalDocumentShell
      lastUpdated={{ label: "March 29, 2026", iso: "2026-03-29" }}
      title={
        <>
          {g.titleLine}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            {g.titleGradient}
          </span>
        </>
      }
      intro={g.intro}
    >
      <div className="space-y-8 sm:space-y-10 text-sm text-muted-foreground leading-relaxed">
        {g.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p key={`${section.heading}-${i}`}>{p}</p>
            ))}
          </section>
        ))}

        <section className="space-y-3 pt-2">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            More guides
          </h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-purple-600 dark:marker:text-purple-400">
            {GUIDE_SLUGS.filter((s) => s !== slug).map((s) => {
              const o = GUIDE_CONTENT[s];
              return (
                <li key={s}>
                  <Link href={guideHref(s)} className={LINK}>
                    {o.titleLine} {o.titleGradient}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/how-we-rate" className={LINK}>
                How we list offers
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </LegalDocumentShell>
  );
}
