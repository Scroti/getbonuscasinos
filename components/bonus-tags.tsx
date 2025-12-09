"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, Star, Zap } from "lucide-react";

interface BonusTagsProps {
  tags: string[];
  exclusive?: boolean;
}

const tagConfig: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
  featured: {
    label: "Featured",
    className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none",
    icon: <Sparkles className="h-2.5 w-2.5" />
  },
  exclusive: {
    label: "Exclusive",
    className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none",
    icon: <Star className="h-2.5 w-2.5" />
  },
  welcome: {
    label: "Welcome",
    className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none",
    icon: <Gift className="h-2.5 w-2.5" />
  },
  "free spins": {
    label: "Free Spins",
    className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
    icon: <Zap className="h-2.5 w-2.5" />
  },
  "high roller": {
    label: "High Roller",
    className: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none",
  },
};

export function BonusTags({ tags, exclusive }: BonusTagsProps) {
  // Normalize tags to lowercase for comparison
  const normalizedTags = tags?.map(t => t.toLowerCase().trim()) || [];
  
  // Filter and prioritize tags
  const displayTags = normalizedTags
    .filter(tag => {
      // Don't show "Featured" on cards (it's used for hero selection)
      return tag !== 'featured';
    })
    .slice(0, 3); // Limit to 3 tags

  // Add exclusive if it's set and not already in tags
  const allTags = exclusive && !normalizedTags.includes('exclusive')
    ? ['exclusive', ...displayTags]
    : displayTags;

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {allTags.map((tag, index) => {
        const lowerTag = tag.toLowerCase();
        const config = tagConfig[lowerTag] || {
          label: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalize first letter
          className: "bg-foreground/10 text-foreground border border-foreground/20"
        };

        return (
          <Badge
            key={`${tag}-${index}`}
            className={`text-[9px] font-bold px-2 py-0.5 shadow-sm flex items-center gap-1 ${config.className}`}
          >
            {config.icon}
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}

