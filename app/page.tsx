import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BonusList } from "@/components/bonus-list";
import { getBonuses } from "@/lib/api";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const bonuses = await getBonuses();

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30">
      <Header />
      <main className="space-y-0">
        <Hero bonuses={bonuses} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BonusList bonuses={bonuses} />
        </div>
      </main>
    </div>
  );
}
