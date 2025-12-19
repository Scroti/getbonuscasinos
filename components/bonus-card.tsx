"use client";

import { Bonus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { BonusTags } from "@/components/bonus-tags";
import Image from "next/image";
import { formatTextWithBreaks } from "@/lib/utils/format-text";

interface BonusCardProps {
  bonus: Bonus;
  featured?: boolean;
}

export function BonusCard({ bonus, featured = false }: BonusCardProps) {
  // Parse description to extract structured bonus information
  const parseDescription = (desc: string) => {
    // Split by periods to get main offer and deposit details
    const parts = desc.split('.').filter(p => p.trim());
    const mainOffer = parts[0]?.trim() || '';
    const depositDetails = parts.slice(1).map(p => p.trim()).filter(p => p);
    return { mainOffer, depositDetails };
  };

  const { mainOffer, depositDetails } = parseDescription(bonus.description);

  return (
    <Card className="group relative overflow-hidden border border-foreground/10 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
      
      <div className="flex flex-row relative z-10">
        {/* Left Section - Image (Square) */}
        <div className="relative w-32 sm:w-40 md:w-56 h-32 sm:h-40 md:h-56 shrink-0 overflow-hidden">
          <Image
            src={bonus.image}
            alt={`${bonus.title} logo`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 128px, 160px"
          />
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-1 flex-col bg-transparent p-3 sm:p-4 md:p-5 h-32 sm:h-40 md:h-56">
          {/* Top Section - Title */}
          <div className="mb-2 sm:mb-3">
            <h3 className="text-xs sm:text-sm md:text-lg font-black text-foreground leading-tight uppercase tracking-tight line-clamp-1">
              {bonus.title}
            </h3>
            <div className="hidden sm:block mt-1">
              <BonusTags tags={bonus.tags || []} exclusive={bonus.exclusive} />
            </div>
          </div>

          {/* Main Content - Compact */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Bonus Offer */}
            {mainOffer && (
              <div className="space-y-1">
                <div className="text-[10px] sm:text-xs md:text-sm text-foreground leading-tight whitespace-pre-line">
                  {formatTextWithBreaks(mainOffer)}
                </div>
                
                {/* Deposit Details - Show on mobile only */}
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
            
            {/* Fallback description */}
            {!mainOffer && bonus.description && (
              <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight whitespace-pre-line">
                {formatTextWithBreaks(bonus.description)}
              </div>
            )}
          </div>

          {/* Bottom Section - Details and Actions */}
          <div className="mt-auto pt-2 sm:pt-3 border-t border-foreground/10">
            {/* Bonus Details - Wagering/MinDeposit (Hidden on mobile, shown on desktop) - Inline format */}
            <div className="hidden sm:flex items-center gap-3 mb-2 text-[10px] sm:text-xs text-muted-foreground">
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

            {/* Verification and Button Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[8px] sm:text-[9px] font-medium text-emerald-700 dark:text-emerald-400 hidden sm:inline">Verified</span>
                </div>
                {bonus.terms && (
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground/70 truncate">{bonus.terms}</span>
                )}
              </div>
              
              {/* Button */}
              <Button asChild className="h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-3 sm:px-4 md:px-6 flex-shrink-0 transition-all duration-300 hover:shadow-lg">
                <a href={bonus.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                  Get Bonus 
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </a>
              </Button>
            </div>

            {/* Promo Code - Below button if exists */}
            {bonus.code && (
              <div className="mt-2 flex items-center justify-center rounded border border-dashed border-foreground/30 bg-muted/30 px-2 py-1 font-mono text-[9px] sm:text-[10px] text-foreground cursor-pointer group/code transition-all duration-300 hover:border-purple-500/50 hover:bg-muted/50">
                <span className="font-bold tracking-wider">{bonus.code}</span>
                <Copy className="ml-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-50 group-hover/code:opacity-100 transition-opacity duration-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
