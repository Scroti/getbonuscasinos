"use client";

import { Bonus } from "@/lib/data";
import { BonusCard } from "@/components/bonus-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatTextWithBreaks } from "@/lib/utils/format-text";
import { AFFILIATE_OUTBOUND_REL } from "@/lib/affiliate-links";

interface HeroProps {
  bonuses: Bonus[];
  featuredBonus: Bonus | null;
}

export function Hero({ bonuses, featuredBonus }: HeroProps) {
  if (!bonuses || bonuses.length === 0 || !featuredBonus) {
    return (
      <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">No Bonuses Available</h1>
          <p className="text-muted-foreground text-lg">We're currently updating our bonus offers. Please check back soon!</p>
        </div>
      </section>
    );
  }

  // Generate casino slug from casino name or brandName (same logic as BonusCard)
  const casinoName = featuredBonus.casino || featuredBonus.brandName || featuredBonus.title;
  const casinoSlug = casinoName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || featuredBonus.id;

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("[data-no-navigate]")) {
      e.preventDefault();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 lg:pt-32 lg:pb-12 transition-colors duration-300">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px] animate-pulse dark:bg-purple-600/20 bg-purple-400/20" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse delay-1000 dark:bg-indigo-600/20 bg-indigo-400/20" />
        <div className="absolute inset-0  opacity-20 mix-blend-overlay" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* One H1 for the whole home hero — avoids duplicate H1 in DOM (mobile + desktop). */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-foreground text-center lg:text-left mb-6 lg:mb-8 max-w-4xl mx-auto lg:mx-0">
          Unlock the{" "}
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 bg-clip-text text-transparent">
            Ultimate Bonuses
          </span>
        </h1>

        {/* Mobile: badge + featured card (card image uses priority for LCP) */}
        <div className="md:hidden space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 backdrop-blur-md">
              <Crown className="mr-2 h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                Exclusive VIP Offer
              </span>
            </div>
          </div>
          <BonusCard bonus={featuredBonus} priority />
        </div>

        {/* md+: copy + desktop visual */}
        <div className="hidden md:grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 backdrop-blur-md mx-auto lg:mx-0">
              <Crown className="mr-2 h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                Exclusive VIP Offer
              </span>
            </div>

            <p className="mx-auto max-w-xl text-sm text-muted-foreground lg:mx-0 lg:text-base leading-relaxed whitespace-pre-line">
              {formatTextWithBreaks(featuredBonus.description)}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-10 min-w-[140px] rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <a href={featuredBonus.link} target="_blank" rel={AFFILIATE_OUTBOUND_REL}>
                  Claim Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              {featuredBonus.code && (
                <div className="flex h-10 items-center rounded-full border border-foreground/10 bg-foreground/5 px-5 backdrop-blur-md transition-colors hover:bg-foreground/10 cursor-pointer group">
                  <span className="font-mono text-sm font-bold text-foreground tracking-widest group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {featuredBonus.code}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground lg:justify-start pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative mx-auto w-full max-w-xs perspective-1000 lg:mx-0 lg:ml-auto">
            <Link
              href={`/casino/${casinoSlug}`}
              className="block relative transform transition-all duration-500 hover:rotate-y-12 hover:rotate-x-12 preserve-3d cursor-pointer"
              onClick={handleCardClick}
              aria-label={`View ${casinoName} review`}
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 dark:opacity-40 blur-2xl animate-pulse" />

              <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/80 dark:bg-gray-900/80 p-5 backdrop-blur-xl shadow-2xl">
                <div className="space-y-3">
                  <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />
                    <Image
                      src={featuredBonus.image}
                      alt={`${featuredBonus.title} promotional image`}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-110"
                      sizes="320px"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-foreground line-clamp-1">
                      {featuredBonus.title}
                    </h2>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-xs line-clamp-1">
                      {featuredBonus.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-foreground/10">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Wagering</span>
                      <span className="text-foreground font-bold">{featuredBonus.wagering ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Min deposit</span>
                      <span className="text-foreground font-bold">{featuredBonus.minDeposit ?? "—"}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Max bonus</span>
                      <span className="text-foreground font-bold">{featuredBonus.maxBonus ?? "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
