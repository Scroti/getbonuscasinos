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
    id: "realz",
    title: "Realz",
    description: "Casino Welcome Offer - 250% up to $4,000 + 150 FS. 1st Deposit: 150% up to $1500 + 50 FS. 2nd Deposit: 50% up to $1000 + 50 FS. 3rd Deposit: 50% up to $1500 + 50 FS.",
    link: "https://www.realz.com/au",
    image: "https://www.correctcasinos.com/wp-content/uploads/2025/11/Realz-Casino.jpg",
    tags: ["Welcome Bonus", "Free Spins"],
    rating: 5,
    terms: "18+. T&Cs apply.",
    wagering: "35x",
    minDeposit: "30$",
    maxBonus: "$4,000"
  },
  {
    id: "monsterwin",
    title: "Monsterwin",
    description: "Casino Welcome Offer - 250% up to $4,000 + 150 FS. 1st Deposit: 150% up to $1500 + 50 FS. 2nd Deposit: 50% up to $1000 + 50 FS. 3rd Deposit: 50% up to $1500 + 50 FS.",
    link: "https://www.monsterwin.com/au",
    image: "/casino-1.png", // Placeholder as source was a page URL
    tags: ["Welcome Bonus", "Free Spins"],
    rating: 5,
    terms: "18+. T&Cs apply.",
    wagering: "35x",
    minDeposit: "30$",
    maxBonus: "$4,000"
  },
  {
    id: "jokery",
    title: "Jokery",
    description: "Casino Welcome Offer - 100% up to $2500 + 100 Free Spins.",
    link: "https://www.jokery.com/au",
    image: "https://cdn.irishluck.ie/filters:format(webp)/fit-in/259x259/1756133916/jokery-jokery-casino-logo-logo.png",
    tags: ["Welcome Bonus", "Free Spins"],
    rating: 5,
    terms: "18+. T&Cs apply.",
    wagering: "35x",
    minDeposit: "30$",
    maxBonus: "$2,500"
  },
  {
    id: "casina",
    title: "Casina",
    description: "Casino Welcome Offer - 300% up to $10000 + 300 Free Spins. 1st Deposit: 100% up to $3500 + 100 FS. 2nd Deposit: 100% up to $3000 + 75 FS. 3rd Deposit: 100% up to $3500 + 125 FS.",
    link: "https://www.casina.com/au",
    image: "https://www.playcasino.com/img/casinos/Casina-casino-logo_102_1223.png",
    tags: ["Welcome Bonus", "Free Spins", "High Roller"],
    rating: 5,
    terms: "18+. T&Cs apply.",
    wagering: "35x",
    minDeposit: "30$",
    maxBonus: "$10,000"
  }
];
