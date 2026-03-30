"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getHomeFaqItems } from "@/lib/home-faq";

const triggerClass =
  "text-[12px] sm:text-[13px] font-semibold text-foreground hover:no-underline [&[data-state=open]]:text-primary py-2 gap-2 min-h-0 [&_svg]:size-3 [&_svg]:translate-y-0 shrink-0";

const contentClass =
  "text-[11px] sm:text-xs text-muted-foreground leading-snug pb-2 pt-0";

const INTRO_PUBLISH_Q = "How we publish these listings";

/** Sits in the footer grid row — matches column heading style and full container width. */
export function FooterFaq({ siteTitle }: { siteTitle: string }) {
  const items = getHomeFaqItems(siteTitle);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-10 xl:gap-14 items-start w-full"
      aria-labelledby="footer-faq-heading"
    >
      <h3
        id="footer-faq-heading"
        className="font-bold text-base sm:text-lg text-foreground lg:pt-0.5 lg:max-w-[11rem]"
      >
        Common questions
      </h3>
      <div className="min-w-0 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 sm:px-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={`${item.question}-${i}`} value={`faq-${i}`} className="border-foreground/10">
              <AccordionTrigger className={triggerClass}>{item.question}</AccordionTrigger>
              <AccordionContent className={contentClass}>
                {item.question === INTRO_PUBLISH_Q ? (
                  <p>
                    Short answers about how we publish listings. {""}
                    <Link
                      href="/how-we-rate"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      How we list offers
                    </Link>{" "}
                    has the full methodology.
                  </p>
                ) : (
                  item.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
