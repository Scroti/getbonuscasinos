import Link from "next/link";
import { headers } from "next/headers";
import { LegalDocumentShell } from "@/components/legal-document-shell";
import { getSiteBrand } from "@/lib/site-brand";

const LINK =
  "text-primary font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline-offset-4 hover:underline";

export default async function HowWeRatePage() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const siteTitle = brand.siteTitle;

  return (
    <LegalDocumentShell
      lastUpdated={{ label: "March 29, 2026", iso: "2026-03-29" }}
      title={
        <>
          How we{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            list offers
          </span>
        </>
      }
      intro={
        <>
          {siteTitle} is a publisher, not a gambling operator. This page states how we organize
          listings and commercial links. It is not a promise of rankings, odds, or winnings.
        </>
      }
    >
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            What we do
          </h2>
          <p>
            We summarize publicly available promotions and casino pages. List order may reflect
            editorial judgment, commercial relationships, or data freshness—not a universal
            ranking of “best” sites for every player.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            Commercial links
          </h2>
          <p>
            Some outbound links are affiliate links: we may earn commission if you sign up or
            deposit through them. Those relationships do not turn us into the casino. See our{" "}
            <Link href="/terms" className={LINK}>
              Terms
            </Link>{" "}
            and on-page{" "}
            <Link href="/#affiliate-disclosure" className={LINK}>
              affiliate disclosure
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            Accuracy and offers
          </h2>
          <p>
            Bonus figures, wagering, and eligibility come from operators or feeds and can change
            without warning. Our pages may lag. The operator&apos;s live terms and offer page are
            the authority before you play.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            Geography and age
          </h2>
          <p>
            Availability depends on your region and local law. You must meet the legal minimum age
            where you are. We do not guarantee that any brand serves your country.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            Contact
          </h2>
          <p>
            Corrections or feedback:{" "}
            <Link href="/contact" className={LINK}>
              Contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </LegalDocumentShell>
  );
}
