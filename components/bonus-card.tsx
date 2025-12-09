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
    <Card className="group relative overflow-hidden border border-foreground/10 bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-500/20 h-24 sm:h-32 md:h-60">
      <div className="flex flex-row h-full">
        {/* Left Section - Square Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-60 md:h-60 shrink-0 border-r border-border/50 bg-muted/20 group-hover:bg-muted/40 transition-colors overflow-hidden">
          <Image
            src={bonus.image}
            alt={`${bonus.title} logo`}
            fill
            className="object-contain md:object-fill p-2 sm:p-3 md:p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 128px, 240px"
          />
          
          {/* Tags overlay on image */}
          <div className="absolute top-2 left-2 z-20">
            <BonusTags tags={bonus.tags || []} exclusive={bonus.exclusive} />
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-1 flex-col justify-between bg-card p-2 sm:p-3 md:p-5 h-full overflow-hidden">
          <div className="space-y-1 sm:space-y-2">
            {/* Title */}
            <h3 className="text-xs sm:text-sm md:text-lg font-bold text-foreground leading-tight uppercase tracking-wide line-clamp-1 md:line-clamp-2">
              {bonus.title}
            </h3>

            {/* Tags - Desktop only */}
            <div className="hidden md:block">
              <BonusTags tags={bonus.tags || []} exclusive={bonus.exclusive} />
            </div>

            {/* Description */}
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-snug sm:leading-relaxed line-clamp-1 md:line-clamp-none">
              {bonus.description}
            </p>
            
            {/* Bonus Details - Hidden on mobile */}
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

          {/* Bottom Actions */}
          <div className="mt-2 sm:mt-4 flex flex-col gap-1.5 sm:gap-3 sm:flex-row sm:items-center sm:justify-end pt-2 sm:pt-4 border-t border-foreground/10">
            {bonus.code && (
              <div className="flex items-center justify-between rounded-lg border border-dashed border-foreground/30 bg-foreground/5 dark:bg-foreground/10 px-2 py-1.5 sm:px-4 sm:py-2.5 font-mono text-[10px] sm:text-sm text-muted-foreground transition-colors hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer group/code w-full sm:w-auto">
                <span className="font-bold tracking-wider">{bonus.code}</span>
                <Copy className="ml-2 sm:ml-3 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 opacity-50 group-hover/code:opacity-100 transition-opacity" />
              </div>
            )}
            <Button asChild className="w-full sm:w-auto h-6 sm:h-10 text-[9px] sm:text-sm md:text-base bg-foreground text-background hover:bg-foreground/90 font-bold transition-all hover:scale-105">
              <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                Get Bonus <ArrowRight className="ml-1 sm:ml-2 h-2.5 w-2.5 sm:h-4 sm:w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
