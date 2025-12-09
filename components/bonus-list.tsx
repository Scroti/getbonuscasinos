"use client";

import { Bonus } from "@/lib/data";
import { BonusCard } from "./bonus-card";
import { Crown } from "lucide-react";

interface BonusListProps {
  bonuses: Bonus[];
}

export function BonusList({ bonuses }: BonusListProps) {
  if (!bonuses || bonuses.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 py-4 bg-background transition-colors duration-300">
      {/* Standard VIP Offers Chip */}
      <div className="flex justify-center md:justify-start py-2">
        <div className="inline-flex items-center rounded-full border border-gray-400/30 bg-gray-400/10 px-3 py-1 backdrop-blur-md">
          <Crown className="mr-2 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Standard VIP Offers
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {bonuses.map((bonus) => (
          <BonusCard key={bonus.id || `bonus-${bonus.title}`} bonus={bonus} />
        ))}
      </div>
    </section>
  );
}
