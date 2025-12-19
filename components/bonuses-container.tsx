'use client';

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BonusList } from "@/components/bonus-list";
import { useGetBonusesQuery } from "@/lib/store/api";

export function BonusesContainer() {
  const { data: bonuses = [], isLoading, isError } = useGetBonusesQuery();

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

  // Determine featured bonus: check for "featured" tag (case-insensitive), otherwise use first bonus
  const featuredBonus = bonuses.find(b => 
    b.tags?.some(tag => tag.toLowerCase() === 'featured')
  ) || bonuses[0] || null;
  
  // Filter out the featured bonus from the regular list
  const regularBonuses = featuredBonus 
    ? bonuses.filter(b => b.id !== featuredBonus.id)
    : bonuses;

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
      <Header />
      <main className="space-y-0">
        <Hero bonuses={bonuses} featuredBonus={featuredBonus} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BonusList bonuses={regularBonuses} />
        </div>
      </main>
    </div>
  );
}

