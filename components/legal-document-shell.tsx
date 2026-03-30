import type { ReactNode } from "react";
import { Header } from "@/components/header";

type LegalDocumentShellProps = {
  /** Visible “Last updated” and `<time dateTime>` */
  lastUpdated: { label: string; iso: string };
  /** Main H1 content; include gradient spans like the Contact hero */
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
};

/**
 * Shared layout for Terms / Privacy (and similar): matches Contact page hero + card panels.
 */
export function LegalDocumentShell({
  lastUpdated,
  title,
  intro,
  children,
}: LegalDocumentShellProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30 flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <section className="relative overflow-hidden py-12 md:py-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px]" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-[80px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center sm:text-left">
              <time dateTime={lastUpdated.iso}>Last updated: {lastUpdated.label}</time>
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl mb-6 text-center sm:text-left">
              {title}
            </h1>
            <div className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-center sm:text-left sm:mx-0">
              {intro}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-foreground/5 bg-foreground/5 p-6 sm:p-8 md:p-10 backdrop-blur-sm max-w-4xl mx-auto shadow-sm">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
