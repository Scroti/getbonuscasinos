"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  items: string[];
  initialShowCount?: number;
  variant?: "outline" | "secondary";
}

export function CollapsibleSection({ 
  title, 
  items, 
  initialShowCount = 6,
  variant = "outline"
}: CollapsibleSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (!items || items.length === 0) return null;

  const displayItems = showAll ? items : items.slice(0, initialShowCount);
  const hasMore = items.length > initialShowCount;

  return (
    <div className="mt-4 sm:mt-6">
      <div className="text-xs font-semibold mb-1.5 sm:mb-2">{title}:</div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {displayItems.map((item, idx) => (
          <Badge key={idx} variant={variant} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">{item}</Badge>
        ))}
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs h-auto p-1 sm:p-1.5"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Show less
              <ChevronUp className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </>
          ) : (
            <>
              +{items.length - initialShowCount} more
              <ChevronDown className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

