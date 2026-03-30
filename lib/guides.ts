/** Evergreen guide slugs and URLs — use for internal linking and sitemap. */
export const GUIDE_SLUGS = [
  "wagering-requirements",
  "how-to-read-bonus-terms",
  "bonus-claim-checklist",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type GuideListItem = {
  slug: GuideSlug;
  label: string;
  /** Short line for cards / strips */
  blurb: string;
};

export const GUIDES_FOR_NAV: GuideListItem[] = [
  {
    slug: "wagering-requirements",
    label: "How wagering requirements work",
    blurb: "What playthrough means and why it changes what a bonus is worth.",
  },
  {
    slug: "how-to-read-bonus-terms",
    label: "How to read casino bonus terms",
    blurb: "What to look for in T&Cs before you deposit or opt in.",
  },
  {
    slug: "bonus-claim-checklist",
    label: "Before you claim a bonus: checklist",
    blurb: "A short list to confirm on the operator’s site—no hype.",
  },
];

export function guideHref(slug: GuideSlug): string {
  return `/guides/${slug}`;
}
