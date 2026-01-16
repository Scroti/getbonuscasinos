"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { Bonus } from "@/lib/data";

interface BonusTabsProps {
  groupedBonuses: Record<string, Bonus[]>;
}

export function BonusTabs({ groupedBonuses }: BonusTabsProps) {
  const [activeTag, setActiveTag] = useState<string>(Object.keys(groupedBonuses)[0] || '');

  // Tag display names
  const tagNames: Record<string, string> = {
    'welcome': 'Welcome',
    'exclusive': 'Exclusive',
    'featured': 'Featured',
    'standard': 'Bonuses'
  };

  const activeBonuses = groupedBonuses[activeTag] || [];

  return (
    <div className="lg:sticky lg:top-6">
      <Card className="p-3 sm:p-4">
        {/* Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {Object.keys(groupedBonuses).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors flex-shrink-0 ${
                activeTag === tag
                  ? 'bg-red-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tagNames[tag] || tag.charAt(0).toUpperCase() + tag.slice(1)}
              <Badge variant="secondary" className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs">
                {groupedBonuses[tag].length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Active Tab Content - Horizontal on mobile, Vertical on desktop */}
        <div className="lg:space-y-2 lg:space-y-3 lg:max-h-[600px] lg:overflow-y-auto lg:scrollbar-hide">
          {/* Mobile: Horizontal Scroll or Full Width if single */}
          <div className={`lg:hidden ${activeBonuses.length === 1 ? '' : 'overflow-x-auto scrollbar-hide -mx-1 px-1 pb-2'}`}>
            <div className={`${activeBonuses.length === 1 ? 'w-full' : 'flex gap-3 min-w-max'}`}>
              {activeBonuses.map((bonus, index) => (
                <Card key={bonus.id || index} className={`p-3 ${activeBonuses.length === 1 ? 'w-full' : 'min-w-[280px] max-w-[280px] flex-shrink-0'}`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </div>
                    <h3 className="text-xs font-bold line-clamp-1">
                      {bonus.title || 'Bonus'}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 break-words">{bonus.description}</p>
                  {(bonus.wagering || bonus.minDeposit) && (
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {bonus.wagering && (
                        <div className="p-1.5 bg-muted rounded">
                          <div className="text-[10px] text-muted-foreground">Wagering</div>
                          <div className="font-semibold text-[10px]">{bonus.wagering}</div>
                        </div>
                      )}
                      {bonus.minDeposit && (
                        <div className="p-1.5 bg-muted rounded">
                          <div className="text-[10px] text-muted-foreground">Min Deposit</div>
                          <div className="font-semibold text-[10px]">{bonus.minDeposit}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {bonus.terms && (
                    <div className="mb-2 p-1.5 bg-muted/50 rounded text-[10px]">
                      <div className="font-semibold text-muted-foreground mb-0.5">Terms</div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 break-words">{bonus.terms}</p>
                    </div>
                  )}
                  {bonus.link && (
                    <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-[10px] py-1.5">
                      <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                        Claim Bonus
                        <ArrowRight className="ml-1.5 h-2.5 w-2.5" />
                      </a>
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
          
          {/* Desktop: Vertical List */}
          <div className="hidden lg:block space-y-2 sm:space-y-3">
            {activeBonuses.map((bonus, index) => (
              <Card key={bonus.id || index} className="p-3 sm:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold line-clamp-1">
                    {bonus.title || 'Bonus'}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words">{bonus.description}</p>
                {(bonus.wagering || bonus.minDeposit) && (
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    {bonus.wagering && (
                      <div className="p-1.5 sm:p-2 bg-muted rounded">
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Wagering</div>
                        <div className="font-semibold text-[10px] sm:text-xs">{bonus.wagering}</div>
                      </div>
                    )}
                    {bonus.minDeposit && (
                      <div className="p-1.5 sm:p-2 bg-muted rounded">
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Min Deposit</div>
                        <div className="font-semibold text-[10px] sm:text-xs">{bonus.minDeposit}</div>
                      </div>
                    )}
                  </div>
                )}
                {bonus.terms && (
                  <div className="mb-2 sm:mb-3 p-1.5 sm:p-2 bg-muted/50 rounded text-[10px] sm:text-xs">
                    <div className="font-semibold text-muted-foreground mb-0.5 sm:mb-1">Terms</div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 break-words">{bonus.terms}</p>
                  </div>
                )}
                {bonus.link && (
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-[10px] sm:text-xs py-1.5 sm:py-2">
                    <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                      Claim Bonus
                      <ArrowRight className="ml-1.5 sm:ml-2 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </a>
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

