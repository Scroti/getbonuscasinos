import Link from "next/link";
import { LegalDocumentShell } from "@/components/legal-document-shell";
import { getSiteBrand } from "@/lib/site-brand";
import { headers } from "next/headers";

const LINK =
  "text-primary font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline-offset-4 hover:underline";

export default async function PrivacyPage() {
  const h = await headers();
  const brand = getSiteBrand(h.get("x-forwarded-host") ?? h.get("host"));
  const siteTitle = brand.siteTitle;

  return (
    <LegalDocumentShell
      lastUpdated={{ label: "March 29, 2026", iso: "2026-03-29" }}
      title={
        <>
          Privacy{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Policy
          </span>
        </>
      }
      intro={
        <>
          This policy describes how {siteTitle}{" "}
          <span className="whitespace-nowrap">(“we”, “us”)</span> handles
          personal information when you use our website and newsletter. It is
          a practical summary, not an exhaustive legal document—where law gives
          you stricter rights, those rights apply.
        </>
      }
    >
      <div className="space-y-8 sm:space-y-10 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            1. Who we are
          </h2>
          <p>
            The site you are visiting is operated as {siteTitle}. For privacy
            questions, use the details on our{" "}
            <Link href="/contact" className={LINK}>
              contact page
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            2. Information we collect
          </h2>
          <ul className="list-disc pl-5 space-y-3 marker:text-purple-600 dark:marker:text-purple-400">
            <li>
              <span className="text-foreground font-medium">Newsletter: </span>
              if you subscribe, we store your email address (and any optional
              profile fields our form collects) to send updates. You may{" "}
              <Link href="/unsubscribe" className={LINK}>
                unsubscribe
              </Link>{" "}
              at any time.
            </li>
            <li>
              <span className="text-foreground font-medium">Technical: </span>
              standard server and analytics data may include IP address, browser
              type, device type, pages viewed, and approximate location derived
              from IP. We use this to run and improve the site and to understand
              traffic.
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
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            3. How we use information
          </h2>
          <p>
            We use personal data to operate the newsletter, respond to
            inquiries, secure the site, analyze usage, comply with law, and
            enforce our terms. We do not sell your email as a standalone
            product; if we use advertising or analytics partners, they process
            data under their policies and appropriate agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            4. Storage and service providers
          </h2>
          <p>
            We use trusted infrastructure providers (for example hosting and
            database services such as Firebase) to store and process data. Those
            providers may be located outside your country. Where required, we
            rely on appropriate safeguards or legal mechanisms for international
            transfers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            5. Retention
          </h2>
          <p>
            We keep information only as long as needed for the purposes above,
            unless a longer period is required by law. Newsletter emails are
            removed when you unsubscribe, subject to reasonable backup and audit
            cycles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            6. Your rights
          </h2>
          <p>
            Depending on where you live, you may have rights to access,
            correct, delete, or restrict processing of your personal data, or to
            object to certain processing. Contact us to exercise these rights.
            You may also complain to your local data protection authority.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            7. Children
          </h2>
          <p>
            Our services are not directed at anyone under the minimum legal age
            for gambling in their region. We do not knowingly collect personal
            information from children.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            8. Changes to this policy
          </h2>
          <p>
            We may update this policy and will change the “Last updated” date
            when we do. Material changes may be highlighted on the site where
            appropriate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-foreground pb-2 border-b border-foreground/10">
            9. Contact
          </h2>
          <p>
            Privacy requests:{" "}
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
