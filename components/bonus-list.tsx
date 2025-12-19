"use client";

import { Bonus } from "@/lib/data";
import { BonusCard } from "./bonus-card";

interface BonusListProps {
  bonuses: Bonus[];
}

export function BonusList({ bonuses }: BonusListProps) {
  if (!bonuses || bonuses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 py-4 bg-background transition-colors duration-300">
      <div className="grid gap-6">
        {bonuses.map((bonus) => (
          <BonusCard key={bonus.id || `bonus-${bonus.title}`} bonus={bonus} />
        ))}
      </div>
    </section>
  );
}
