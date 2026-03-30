import { headers } from "next/headers";
import Link from "next/link";
import { Header } from "@/components/header";
import { getSiteBrand } from "@/lib/site-brand";

export default async function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            This policy describes how {siteTitle} (“we”, “us”) handles personal
            information when you use our website and newsletter. It is a
            practical summary, not an exhaustive legal document—where law gives
            you stricter rights, those rights apply.
          </p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                1. Who we are
              </h2>
              <p>
                The site you are visiting is operated as {siteTitle}. For
                privacy questions, use the details on our{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                2. Information we collect
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="text-foreground font-medium">Newsletter: </span>
                  if you subscribe, we store your email address (and any optional
                  profile fields our form collects) to send updates. You may{" "}
                  <Link
                    href="/unsubscribe"
                    className="text-primary hover:underline"
                  >
                    unsubscribe
                  </Link>{" "}
                  at any time.
                </li>
                <li>
                  <span className="text-foreground font-medium">Technical: </span>
                  standard server and analytics data may include IP address,
                  browser type, device type, pages viewed, and approximate
                  location derived from IP. We use this to run and improve the
                  site and to understand traffic.
                </li>
                <li>
                  <span className="text-foreground font-medium">Cookies: </span>
                  we and our vendors may use cookies or similar technologies for
                  essential functionality, preferences, and measurement. You can
                  control cookies through your browser settings.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                3. How we use information
              </h2>
              <p>
                We use personal data to operate the newsletter, respond to
                inquiries, secure the site, analyze usage, comply with law, and
                enforce our terms. We do not sell your email as a standalone
                product; if we use advertising or analytics partners, they
                process data under their policies and appropriate agreements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                4. Storage and service providers
              </h2>
              <p>
                We use trusted infrastructure providers (for example hosting and
                database services such as Firebase) to store and process data.
                Those providers may be located outside your country. Where
                required, we rely on appropriate safeguards or legal mechanisms
                for international transfers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">5. Retention</h2>
              <p>
                We keep information only as long as needed for the purposes
                above, unless a longer period is required by law. Newsletter
                emails are removed when you unsubscribe, subject to reasonable
                backup and audit cycles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">6. Your rights</h2>
              <p>
                Depending on where you live, you may have rights to access,
                correct, delete, or restrict processing of your personal data,
                or to object to certain processing. Contact us to exercise these
                rights. You may also complain to your local data protection
                authority.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">7. Children</h2>
              <p>
                Our services are not directed at anyone under the minimum legal
                age for gambling in their region. We do not knowingly collect
                personal information from children.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">
                8. Changes to this policy
              </h2>
              <p>
                We may update this policy and will change the “Last updated”
                date when we do. Material changes may be highlighted on the
                site where appropriate.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">9. Contact</h2>
              <p>
                Privacy requests:{" "}
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
