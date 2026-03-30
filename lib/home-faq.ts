/** Visible homepage FAQs — same strings feed FAQPage JSON-LD (must match on-page text). */

export type HomeFaqItem = {
  question: string;
  /** Plain text only — used for display and schema Answer.text */
  answer: string;
};

export function getHomeFaqItems(siteTitle: string): HomeFaqItem[] {
  return [
    {
      question: "How we publish these listings",
      answer:
        "Short answers about how we publish listings. How we list offers has the full methodology.",
    },
    {
      question: `Is ${siteTitle} an online casino?`,
      answer: `No. ${siteTitle} is an independent publisher that summarizes publicly available operator promotions. We do not take bets, hold balances, or run games. Always confirm offers, rules, and eligibility on the operator’s official site before you deposit.`,
    },
    {
      question: "Will the bonus on this page always match the operator’s website?",
      answer:
        "Not necessarily. Welcome offers, wagering rules, and eligibility change often. We aim to keep summaries accurate, but operators update terms without notice. Use our listings as a starting point and verify every detail on the brand’s own terms before you opt in or deposit.",
    },
    {
      question: 'What happens when I click "Get Bonus"?',
      answer:
        "You leave this site and open the operator (or a tracked partner page). We may earn a commission if you sign up or deposit through certain links. That does not change the price you pay, but it is a commercial relationship—see the affiliate disclosure in the footer.",
    },
    {
      question: "How do you decide which offers appear and in what order?",
      answer:
        'List order can reflect editorial judgment, freshness, or commercial relationships—not a single universal "best" order for every player. We explain our approach on the How we list offers page.',
    },
    {
      question: "What are wagering requirements?",
      answer:
        "They describe how much you need to bet (play through) before bonus-related winnings can be withdrawn, and under what games or time limits. The exact multiple and rules are defined only in the operator’s terms. Our guide on wagering requirements explains the concept in plain language.",
    },
    {
      question: "Is online gambling legal where I am?",
      answer:
        "Laws and licensing differ by country and region, and offers may not be available everywhere. You are responsible for complying with local rules. If you choose to gamble, use licensed operators where applicable, set limits, and seek help if play stops feeling fun.",
    },
  ];
}
