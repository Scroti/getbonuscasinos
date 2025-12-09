'use client';

import { useMemo } from 'react';
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BonusList } from "@/components/bonus-list";
import { useGetBonusesQuery } from "@/lib/store/api";

export function BonusesContainer() {
  const { data: bonuses = [], isLoading, isError } = useGetBonusesQuery();

  // Select featured bonus using tags (looks for "Featured" tag)
  // Using useMemo to keep it stable across renders
  // Must be called before any conditional returns (Rules of Hooks)
  const featuredBonus = useMemo(() => {
    if (bonuses.length === 0) return null;
    // Find bonus with "Featured" tag (case-insensitive)
    const featured = bonuses.find(b => 
      b.tags?.some(tag => tag.toLowerCase() === 'featured')
    );
    return featured || bonuses[0];
  }, [bonuses]);

  // Filter out featured bonus from the list
  const standardBonuses = useMemo(() => {
    if (!featuredBonus) return bonuses;
    return bonuses.filter(bonus => bonus.id !== featuredBonus.id);
  }, [bonuses, featuredBonus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
        <Header />
        <main className="space-y-0">
          <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 lg:pt-32 lg:pb-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground">Loading bonuses...</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
        <Header />
        <main className="space-y-0">
          <section className="relative w-full overflow-hidden bg-background pt-24 pb-8 lg:pt-32 lg:pb-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-3">No Bonuses Available</h1>
              <p className="text-muted-foreground text-lg">We're currently updating our bonus offers. Please check back soon!</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
      <Header />
      <main className="space-y-0">
        <Hero bonuses={bonuses} featuredBonus={featuredBonus} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BonusList bonuses={standardBonuses} />
        </div>
      </main>
    </div>
  );
}

