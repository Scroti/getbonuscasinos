"use client";

import { Bonus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import { BonusTags } from "@/components/bonus-tags";
import Image from "next/image";

interface BonusCardProps {
  bonus: Bonus;
}

export function BonusCard({ bonus }: BonusCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-foreground/10 bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-500/20 min-h-24 sm:min-h-32 md:min-h-60">
      <div className="flex flex-row min-h-full">
        {/* Left Section - Square Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-60 md:h-60 shrink-0 border-r border-border/50 bg-muted/20 group-hover:bg-muted/40 transition-colors overflow-hidden">
          <Image
            src={bonus.image}
            alt={`${bonus.title} logo`}
            fill
            className="object-contain md:object-fill transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 128px, 240px"
          />
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-1 flex-col justify-between bg-card p-2 sm:p-3 md:p-5 min-h-full overflow-visible">
          <div className="space-y-1.5 sm:space-y-2 md:space-y-3 flex-1">
            {/* Title */}
            <h3 className="text-xs sm:text-sm md:text-lg font-bold text-foreground leading-tight uppercase tracking-wide line-clamp-1 md:line-clamp-2">
              {bonus.title}
            </h3>

            {/* Tags - Hidden on mobile, show on desktop */}
            <div className="hidden sm:block flex-shrink-0">
              <BonusTags tags={bonus.tags || []} exclusive={bonus.exclusive} />
            </div>

            {/* Description - Show on mobile, full on desktop */}
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-1 md:line-clamp-none">
              {bonus.description}
            </p>
            
            {/* Bonus Details - Hidden on mobile, show on desktop */}
            <div className="hidden md:flex flex-col gap-1.5 text-xs text-muted-foreground">
              {bonus.wagering && (
                <div>
                  <span className="font-semibold text-foreground">Wagering:</span> {bonus.wagering}
                </div>
              )}
              {bonus.minDeposit && (
                <div>
                  <span className="font-semibold text-foreground">Min Deposit:</span> {bonus.minDeposit}
                </div>
              )}
              {bonus.maxBonus && (
                <div>
                  <span className="font-semibold text-foreground">Max Bonus:</span> {bonus.maxBonus}
                </div>
              )}
            </div>

            {/* Verification and Terms - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                <span>Verified today</span>
              </div>
              {bonus.terms && (
                <>
                  <div className="h-1 w-1 rounded-full bg-foreground/30" />
                  <span>{bonus.terms}</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Actions - Always visible, properly spaced */}
          <div className="mt-auto pt-2 sm:pt-3 md:pt-4 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-end border-t border-foreground/10 flex-shrink-0">
            {bonus.code && (
              <div className="flex items-center justify-between rounded-lg border border-dashed border-foreground/30 bg-foreground/5 dark:bg-foreground/10 px-3 py-2 sm:px-4 sm:py-2.5 font-mono text-[10px] sm:text-sm text-muted-foreground transition-colors hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer group/code w-full sm:w-auto">
                <span className="font-bold tracking-wider">{bonus.code}</span>
                <Copy className="ml-2 sm:ml-3 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 opacity-50 group-hover/code:opacity-100 transition-opacity" />
              </div>
            )}
            <Button asChild className="w-full sm:w-auto h-9 sm:h-10 md:h-11 text-[11px] sm:text-sm md:text-base bg-foreground text-background hover:bg-foreground/90 font-bold transition-all hover:scale-105 px-4 sm:px-6 flex-shrink-0">
              <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                Get Bonus <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
