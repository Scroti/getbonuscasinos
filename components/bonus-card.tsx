"use client";

import { Bonus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface BonusCardProps {
  bonus: Bonus;
}

export function BonusCard({ bonus }: BonusCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-foreground/10 bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-500/20">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Square Image */}
        <div className="relative w-full h-30 md:w-60 md:h-60 shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-muted/20 group-hover:bg-muted/40 transition-colors">
          <Image
            src={bonus.image}
            alt={`${bonus.title} logo`}
            fill
            className="object-fill transition-transform duration-500 group-hover:scale-105"
          />
          
          {bonus.exclusive && (
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none font-bold text-[10px] px-2 py-0.5 shadow-sm">
                EXCLUSIVE
              </Badge>
            </div>
          )}
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-1 flex-col justify-between bg-card p-5">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="text-lg font-bold text-foreground leading-tight uppercase tracking-wide">
              {bonus.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {bonus.description}
            </p>
            
            {/* Bonus Details */}
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
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

            {/* Verification and Terms */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
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
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end pt-4 border-t border-foreground/10">
            {bonus.code && (
              <div className="flex items-center justify-between rounded-lg border border-dashed border-foreground/30 bg-foreground/5 dark:bg-foreground/10 px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer group/code w-full sm:w-auto">
                <span className="font-bold tracking-wider">{bonus.code}</span>
                <Copy className="ml-3 h-3.5 w-3.5 opacity-50 group-hover/code:opacity-100 transition-opacity" />
              </div>
            )}
            <Button asChild className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold transition-all hover:scale-105">
              <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                Get Bonus <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
