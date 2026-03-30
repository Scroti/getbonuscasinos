import { headers } from "next/headers";
import Link from "next/link";
import { Header } from "@/components/header";
import { getSiteBrand } from "@/lib/site-brand";

export default async function TermsPage() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const siteTitle = brand.siteTitle;

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground mb-6">
            Last updated: March 29, 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            These terms explain how you may use {siteTitle} (“we”, “us”, “our”).
            They are general information and not legal advice. If you need
            guidance on gambling laws or contracts, speak to a qualified
            professional.
          </p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                1. About this website
              </h2>
              <p>
                {siteTitle} publishes editorial content about online gambling
                operators, promotions, and related topics. We may earn
                commissions or other compensation when you interact with
                third-party operators through links on this site. That
                relationship does not change our obligation to present
                information fairly, but it may influence which offers we cover.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                2. Eligibility and responsible play
              </h2>
              <p>
                Gambling is restricted to adults. You must meet the minimum age
                and legal requirements in your jurisdiction. Offers, bonuses, and
                games may not be available where you live. You are responsible
                for complying with local law. If gambling is causing harm,
                please use recognized responsible-gambling resources (for
                example{" "}
                <a
                  href="https://www.begambleaware.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium text-foreground"
                >
                  BeGambleAware.org
                </a>
                ).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                3. No warranty; operator terms apply
              </h2>
              <p>
                Information on this site (including bonus amounts, wagering
                requirements, and availability) is provided for general
                information and may change without notice. Operators’ official
                terms, conditions, and websites control any offer you claim.
                We do not guarantee winnings, outcomes, or uninterrupted access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                4. Third-party websites
              </h2>
              <p>
                Links to casinos, sportsbooks, and other third parties leave
                our site. We do not control their content, privacy practices,
                or security. Review their terms and privacy policies before
                signing up or depositing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                5. Acceptable use
              </h2>
              <p>
                You agree not to misuse the site (for example scraping at a
                rate that disrupts our systems, attempting unauthorized access,
                or using the site for unlawful purposes). We may suspend or
                restrict access where reasonably necessary.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                6. Intellectual property
              </h2>
              <p>
                The site design, branding, and original text belong to us or
                our licensors unless stated otherwise. You may not copy or
                redistribute our content for commercial use without permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                7. Limitation of liability
              </h2>
              <p>
                To the maximum extent permitted by law, we are not liable for
                indirect or consequential losses arising from your use of the
                site or reliance on its content. Some jurisdictions do not allow
                certain limitations; in those places our liability is limited to
                the fullest extent allowed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                8. Changes
              </h2>
              <p>
                We may update these terms from time to time. The “Last updated”
                date at the top will change when we do. Continued use of the
                site after changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">9. Contact</h2>
              <p>
                Questions about these terms:{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
