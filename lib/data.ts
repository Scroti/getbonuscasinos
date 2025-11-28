export interface Bonus {
  id: string;
  title: string;
  description: string;
  code?: string;
  link: string;
  image: string;
  tags: string[];
  rating: number;
  exclusive?: boolean;
  terms?: string;
  wagering?: string;
  minDeposit?: string;
  maxBonus?: string;
}

export const featuredBonus: Bonus = {
  id: "featured-1",
  title: "Exclusive 500% Welcome Bonus",
  description: "Get up to $5000 + 100 Free Spins on your first deposit. This is a limited time offer for new players only.",
  code: "WELCOME500",
  link: "#",
  image: "/hero-bg.jpg", // Placeholder, will use a CSS gradient or color if image fails
  tags: ["Exclusive", "High Roller", "Instant Payout"],
  rating: 4.9,
  exclusive: true,
  terms: "18+. New players only. Min deposit $20. Wagering 35x."
};

export const bonuses: Bonus[] = [
  {
    id: "featured-1",
    title: "Exclusive 500% Welcome Bonus",
    description: "Get up to $5000 + 100 Free Spins on your first deposit. This is a limited time offer for new players only.",
    code: "WELCOME500",
    link: "#",
    image: "/hero-bg.png",
    tags: ["Exclusive", "High Roller", "Instant Payout"],
    rating: 4.9,
    exclusive: true,
    terms: "18+. New players only. Min deposit $20. Wagering 35x.",
    wagering: "35x",
    minDeposit: "$20",
    maxBonus: "$5,000"
  },
  {
    id: "bonus-1",
    title: "100% Match up to $1000",
    description: "Double your first deposit and start playing with twice the bankroll.",
    link: "#",
    image: "/casino-1.png",
    tags: ["Welcome Offer", "Low Wagering", "Featured"],
    rating: 4.5,
    terms: "18+. T&Cs apply.",
    wagering: "25x",
    minDeposit: "$10",
    maxBonus: "$1,000"
  },
  {
    id: "bonus-2",
    title: "200 Free Spins No Deposit",
    description: "Sign up today and get 200 free spins on Starburst, no deposit required.",
    code: "FREE200",
    link: "#",
    image: "/casino-2.png",
    tags: ["No Deposit", "Free Spins"],
    rating: 4.7,
    terms: "18+. Max cashout $100.",
    wagering: "40x",
    minDeposit: "$0",
    maxBonus: "200 FS"
  },
  {
    id: "bonus-3",
    title: "Crypto Special: 5 BTC Bonus",
    description: "Huge welcome package for crypto depositors. Valid for BTC, ETH, and LTC.",
    link: "#",
    image: "/casino-3.png",
    tags: ["Crypto", "High Limit"],
    rating: 4.8,
    terms: "18+. Crypto only.",
    wagering: "30x",
    minDeposit: "$50",
    maxBonus: "5 BTC"
  }
];
