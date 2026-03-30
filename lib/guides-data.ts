import type { GuideSlug } from "@/lib/guides";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

export type GuideRecord = {
  titleLine: string;
  titleGradient: string;
  metaDescription: string;
  intro: string;
  sections: GuideSection[];
};

export const GUIDE_CONTENT: Record<GuideSlug, GuideRecord> = {
  "wagering-requirements": {
    titleLine: "Wagering requirements",
    titleGradient: "explained",
    metaDescription:
      "Plain-language guide to casino bonus wagering (playthrough): how it works, what counts toward it, and why you should read the operator’s rules.",
    intro:
      "This guide explains common ideas behind wagering (“playthrough”) on deposit bonuses. It is general education only. Every brand sets its own rules in official terms.",
    sections: [
      {
        heading: "What wagering usually means",
        paragraphs: [
          "A wagering requirement is how much you need to bet, using bonus-related funds, before the operator treats winnings as withdrawable. It is usually written as a multiple, for example “35x bonus” or “35x bonus + deposit.”",
          "The multiple applies to an amount defined in the offer: sometimes the bonus only, sometimes the bonus plus your qualifying deposit. The operator’s offer page and general terms state which definition applies.",
        ],
      },
      {
        heading: "Game weighting and exclusions",
        paragraphs: [
          "Many offers only count a fraction of each bet from certain games (e.g. some table games or live casino). Some titles may be excluded entirely while a bonus is active.",
          "Do not assume all slots or bets count equally. Check the promotion’s terms on the operator’s site.",
        ],
      },
      {
        heading: "Time limits and forfeiture",
        paragraphs: [
          "Bonuses often have an expiry. If you do not meet wagering in time, the operator may remove the bonus balance or associated winnings according to their rules.",
          "If anything on an affiliate site disagrees with the operator’s live terms, the operator wins.",
        ],
      },
      {
        heading: "No promises",
        paragraphs: [
          "We do not calculate your expected profit or guarantee any outcome. Use this page to know what questions to ask and where to look on the brand you choose.",
        ],
      },
    ],
  },
  "how-to-read-bonus-terms": {
    titleLine: "How to read",
    titleGradient: "bonus terms",
    metaDescription:
      "What to look for in casino bonus terms: eligibility, wagering, games, time limits, and country rules—always confirmed on the operator’s site.",
    intro:
      "Bonus terms are a contract between you and the operator for that promotion. This page lists common sections to read slowly. It is not a substitute for the operator’s current documents.",
    sections: [
      {
        heading: "Eligibility",
        paragraphs: [
          "Check who can claim the offer: new customers only, one per household, payment methods excluded (e.g. some e-wallets), or region locks. Your account may be voided if you are not eligible.",
        ],
      },
      {
        heading: "Wagering and maximum bet",
        paragraphs: [
          "Find the multiple, what amount it applies to, and whether there is a max bet while playing with bonus funds. Breaking a max bet rule can void winnings under many sets of terms.",
        ],
      },
      {
        heading: "Games and contributions",
        paragraphs: [
          "Look for lists of excluded games and contribution percentages. A headline “100% bonus” does not mean every game counts fully toward clearing the requirement.",
        ],
      },
      {
        heading: "Withdrawals and stacking",
        paragraphs: [
          "Some sites restrict withdrawals until wagering is complete or limit stacking promotions. Read the sections on cancellation, withdrawal, and “one bonus at a time” if present.",
        ],
      },
      {
        heading: "Primary source",
        paragraphs: [
          "Save or screenshot the offer page and the general bonus terms from the operator on the day you claim. Affiliate summaries can be out of date within hours.",
        ],
      },
    ],
  },
  "bonus-claim-checklist": {
    titleLine: "Before you claim",
    titleGradient: "a checklist",
    metaDescription:
      "Practical checklist before claiming a casino bonus: identity, eligibility, wagering, time limits, and confirming the offer on the operator’s website.",
    intro:
      "Use this list before you deposit or opt in. It is designed to reduce surprises, not to replace legal or financial advice.",
    sections: [
      {
        heading: "On the operator’s own site",
        paragraphs: [
          "Open the promotion from the operator’s domain. Read the offer page and the linked general terms. If the link comes from an affiliate, compare numbers and headlines to what the operator displays.",
        ],
      },
      {
        heading: "Identity and account",
        paragraphs: [
          "Confirm you can verify your account under their KYC rules. Bonuses are often tied to verified profiles and one account per person or address.",
        ],
      },
      {
        heading: "Money and payment method",
        paragraphs: [
          "Check minimum deposit, excluded deposit methods, currency, and whether the bonus credits automatically or needs a code. Note max bet and max conversion if stated.",
        ],
      },
      {
        heading: "Jurisdiction and age",
        paragraphs: [
          "Confirm the brand accepts play from your region and that you meet the legal minimum age. Offers may differ by country.",
        ],
      },
      {
        heading: "Responsible gambling",
        paragraphs: [
          "Set deposit or time limits if the operator offers them. If gambling is harming you or someone else, use independent help such as BeGambleAware or your local program.",
        ],
      },
    ],
  },
};
