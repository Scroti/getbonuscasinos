import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GUIDES_FOR_NAV, guideHref } from "@/lib/guides";

/** Internal links from review pages to evergreen guides. */
export function CasinoGuidesBlock() {
  return (
    <Card className="p-4 sm:p-6 mt-6 sm:mt-8">
      <h2 className="text-sm sm:text-base font-bold text-foreground mb-3">
        Helpful guides
      </h2>
      <ul className="space-y-2.5 text-xs sm:text-sm">
        {GUIDES_FOR_NAV.map((g) => (
          <li key={g.slug}>
            <Link
              href={guideHref(g.slug)}
              className="text-primary font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline-offset-2 hover:underline"
            >
              {g.label}
            </Link>
            <span className="text-muted-foreground"> — {g.blurb}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
