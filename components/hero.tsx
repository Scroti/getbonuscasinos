"use client";

import { Bonus } from "@/lib/data";
import { BonusCard } from "@/components/bonus-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Crown } from "lucide-react";
import { BonusTags } from "@/components/bonus-tags";
import Image from "next/image";

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

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 lg:pt-32 lg:pb-12 transition-colors duration-300">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px] animate-pulse dark:bg-purple-600/20 bg-purple-400/20" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px] animate-pulse delay-1000 dark:bg-indigo-600/20 bg-indigo-400/20" />
        <div className="absolute inset-0  opacity-20 mix-blend-overlay" />
      </div>

      {/* Bottom Fade Gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Show Text + Featured Bonus Card */}
        <div className="md:hidden space-y-6">
          {/* Hero Text */}
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-black leading-tight tracking-tighter text-foreground">
              Unlock the <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 bg-clip-text text-transparent">
                Ultimate Bonuses
              </span>
            </h1>

            <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 backdrop-blur-md">
              <Crown className="mr-2 h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                Exclusive VIP Offer
              </span>
            </div>
          </div>

          {/* Featured Bonus Card - Special Styling */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg opacity-20 blur-sm animate-pulse" />
            
            {/* Card with special styling */}
            <div className="relative bg-card/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden">
              <div className="flex flex-row h-32">
                {/* Image Section */}
                <div className="relative w-32 h-32 shrink-0 border-r border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 overflow-hidden">
                  <Image
                    src={featuredBonus.image}
                    alt={featuredBonus.title}
                    fill
                    className="object-contain p-3"
                    sizes="128px"
                  />
                  {featuredBonus.exclusive && (
                    <div className="absolute top-2 left-2 z-20">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        EXCLUSIVE
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-3 h-full overflow-hidden">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-foreground leading-tight uppercase tracking-wide line-clamp-1">
                      {featuredBonus.title}
                    </h3>
                    {/* Tags */}
                    <BonusTags tags={featuredBonus.tags || []} exclusive={featuredBonus.exclusive} />
                    <p className="text-[9px] text-muted-foreground leading-snug line-clamp-2">
                      {featuredBonus.description}
                    </p>
                  </div>

                  <Button asChild className="h-6 text-[9px] px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 font-bold transition-all hover:scale-105">
                    <a href={featuredBonus.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      Get Bonus <ArrowRight className="ml-1 h-2.5 w-2.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Show Original Text Layout */}
        <div className="hidden md:grid gap-6 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 backdrop-blur-md">
              <Crown className="mr-2 h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                Exclusive VIP Offer
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
              Unlock the <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 bg-clip-text text-transparent">
                Ultimate Bonuses
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-sm text-muted-foreground lg:mx-0 lg:text-base leading-relaxed">
              {featuredBonus.description}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-10 min-w-[140px] rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <a href={featuredBonus.link} target="_blank" rel="noopener noreferrer">
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
                <span>Verified & Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-500" />
                <span>Instant Payout</span>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Card */}
          <div className="hidden lg:block relative mx-auto w-full max-w-xs perspective-1000 lg:mx-0 lg:ml-auto">
            <div className="relative transform transition-all duration-500 hover:rotate-y-12 hover:rotate-x-12 preserve-3d">
              {/* Glow Behind */}
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 dark:opacity-40 blur-2xl animate-pulse" />

              {/* Main Card */}
              <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/80 dark:bg-gray-900/80 p-5 backdrop-blur-xl shadow-2xl">
                {/* Card Content */}
                <div className="space-y-3">
                  <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/10">
                    {/* Fallback gradient if image fails to load or is placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50" />
                    <Image
                      src={featuredBonus.image}
                      alt={featuredBonus.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-1">{featuredBonus.title}</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-xs line-clamp-1">{featuredBonus.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-foreground/10">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Wagering</span>
                      <span className="text-foreground font-bold">{featuredBonus.wagering || "35x"}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Min Deposit</span>
                      <span className="text-foreground font-bold">{featuredBonus.minDeposit || "$20"}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Max Bonus</span>
                      <span className="text-foreground font-bold">{featuredBonus.maxBonus || "Unlimited"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
