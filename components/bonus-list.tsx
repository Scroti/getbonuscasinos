"use client";

import { Bonus } from "@/lib/data";
import { BonusCard } from "./bonus-card";

interface BonusListProps {
  bonuses: Bonus[];
}

export function BonusList({ bonuses }: BonusListProps) {
  return (
    <section className="space-y-8 py-4 bg-background transition-colors duration-300">
      <div className="grid gap-6">
        {bonuses.map((bonus) => (
          <BonusCard key={bonus.id} bonus={bonus} />
        ))}
      </div>
    </section>
  );
}
