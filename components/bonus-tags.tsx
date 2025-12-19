import { Badge } from "@/components/ui/badge";

interface BonusTagsProps {
  tags: string[];
  exclusive?: boolean;
}

export function BonusTags({ tags, exclusive }: BonusTagsProps) {
  if (!tags.length && !exclusive) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1">
      {exclusive && (
        <Badge 
          variant="default" 
          className="text-[8px] sm:text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold border-0"
        >
          Exclusive
        </Badge>
      )}
      {tags.map((tag, index) => (
        <Badge 
          key={index}
          variant="secondary" 
          className="text-[8px] sm:text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground font-medium"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

