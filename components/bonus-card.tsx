"use client";

import { Bonus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BonusTags } from "@/components/bonus-tags";
import Image from "next/image";
import Link from "next/link";
import { formatTextWithBreaks } from "@/lib/utils/format-text";
import { AFFILIATE_OUTBOUND_REL } from "@/lib/affiliate-links";

interface BonusCardProps {
  bonus: Bonus;
  featured?: boolean;
  /** First visible card on home — improves LCP when this image is the hero visual. */
  priority?: boolean;
}

export function BonusCard({ bonus, featured = false, priority = false }: BonusCardProps) {
  const parseDescription = (desc: string) => {
    const parts = desc.split(".").filter((p) => p.trim());
    const mainOffer = parts[0]?.trim() || "";
    const depositDetails = parts.slice(1).map((p) => p.trim()).filter((p) => p);
    return { mainOffer, depositDetails };
  };

  const { mainOffer, depositDetails } = parseDescription(bonus.description);

  const casinoName = bonus.casino || bonus.brandName || bonus.title;
  const casinoSlug = casinoName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || bonus.id;

  const reviewHref = `/casino/${casinoSlug}`;
  const reviewLabel = `View ${casinoName} review`;

  return (
    <Card className="group relative overflow-hidden border border-foreground/10 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-row relative items-stretch">
        {/* Review link: image only — avoids nesting <a> inside outer link */}
        <Link
          href={reviewHref}
          className="relative w-32 sm:w-40 md:w-56 min-h-32 sm:min-h-40 md:min-h-56 shrink-0 self-stretch overflow-hidden block"
          aria-label={reviewLabel}
        >
          <Image
            src={bonus.image}
            alt={`${bonus.title} logo`}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 224px"
          />
        </Link>

        <div className="flex flex-1 flex-col min-w-0 min-h-32 sm:min-h-40 md:min-h-56">
          {/* Review link: title + body + wagering — sibling to CTA row, not wrapping external links */}
          <Link
            href={reviewHref}
            aria-label={reviewLabel}
            className="flex flex-1 flex-col bg-transparent p-3 sm:p-4 md:p-5 pb-2 sm:pb-2 text-left cursor-pointer"
          >
            <div className="mb-2 sm:mb-3 shrink-0">
              <h3 className="text-xs sm:text-sm md:text-lg font-black text-foreground leading-tight uppercase tracking-tight line-clamp-1">
                {bonus.title}
              </h3>
              <div className="hidden sm:block mt-1">
                <BonusTags tags={bonus.tags || []} exclusive={bonus.exclusive} />
              </div>
            </div>

            <div>
              {mainOffer && (
                <div className="space-y-1">
                  <div className="text-[10px] sm:text-xs md:text-sm text-foreground leading-tight whitespace-pre-line">
                    {formatTextWithBreaks(mainOffer)}
                  </div>
                  {depositDetails.length > 0 && (
                    <div className="space-y-0.5 mt-1 sm:hidden">
                      {depositDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-1 text-[9px] text-muted-foreground">
                          <span className="text-purple-500 dark:text-purple-400 mt-0.5">•</span>
                          <span className="leading-tight whitespace-pre-line">{formatTextWithBreaks(detail)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!mainOffer && bonus.description && (
                <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight whitespace-pre-line">
                  {formatTextWithBreaks(bonus.description)}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 mt-2 text-[10px] sm:text-xs text-muted-foreground shrink-0">
              {bonus.wagering && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  <span className="font-semibold text-foreground">Wagering:</span>
                  <span>{bonus.wagering}</span>
                </div>
              )}
              {bonus.minDeposit && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  <span className="font-semibold text-foreground">Min Deposit:</span>
                  <span>{bonus.minDeposit}</span>
                </div>
              )}
              {bonus.maxBonus && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  <span className="font-semibold text-foreground">Max Bonus:</span>
                  <span>{bonus.maxBonus}</span>
                </div>
              )}
            </div>
          </Link>

          {/* External CTA — outside any review <Link> */}
          <div className="mt-auto px-3 sm:px-4 md:px-5 pt-0 sm:pt-1 pb-3 sm:pb-4 md:pb-5 border-t border-foreground/10 shrink-0">
            <div className="sm:hidden flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground mb-2">
              {bonus.wagering && (
                <span>
                  <span className="font-semibold text-foreground">Wagering:</span> {bonus.wagering}
                </span>
              )}
              {bonus.minDeposit && (
                <span>
                  <span className="font-semibold text-foreground">Min:</span> {bonus.minDeposit}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span className="text-[8px] sm:text-[9px] font-medium text-emerald-700 dark:text-emerald-400">
                    Verified
                  </span>
                </div>
                {bonus.terms && (
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground/70 truncate">{bonus.terms}</span>
                )}
              </div>
              {bonus.link ? (
                <Button
                  asChild
                  className="h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-3 sm:px-4 md:px-6 flex-shrink-0 transition-all duration-300 hover:shadow-lg relative z-20 flex items-center justify-center gap-1"
                >
                  <a href={bonus.link} target="_blank" rel={AFFILIATE_OUTBOUND_REL}>
                    Get Bonus
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
