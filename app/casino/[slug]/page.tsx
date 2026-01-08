import { notFound } from "next/navigation";
import { getBonusesFromFirestore } from "@/lib/firebase/firestore";
import { getCasinoBySlug, getCasinoById } from "@/lib/firebase/casinos";
import { Bonus, Casino } from "@/lib/data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Globe, MessageCircle, ExternalLink, Sparkles, TrendingUp, TrendingDown, Mail } from "lucide-react";
import { Header } from "@/components/header";
import { CollapsibleSection } from "@/components/collapsible-section";
import { BonusTabs } from "@/components/bonus-tabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCasinoData(slug: string): Promise<{ casino: Casino | null; bonuses: Bonus[] }> {
  try {
    let casino = await getCasinoBySlug(slug);
    let bonuses: Bonus[] = [];
    const allBonuses = await getBonusesFromFirestore();
    
    if (casino) {
      // Get all bonuses that match this casino
      bonuses = allBonuses.filter((b) => {
        // First check by casinoId if it's a string
        if (b.casinoId && typeof b.casinoId === 'string' && casino) {
          return b.casinoId === casino.id;
        }
        // Then check by brandName matching casino name
        const bonusBrandName = b.casino || b.brandName || '';
        const casinoName = casino?.name || '';
        if (bonusBrandName && casinoName) {
          return bonusBrandName.toLowerCase().trim() === casinoName.toLowerCase().trim();
        }
        // Also check if slug matches
        const bonusSlug = bonusBrandName
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || '';
        return bonusSlug === slug;
      });
    } else {
      // Try to find casino by matching bonus brandName to slug
      const firstBonus = allBonuses.find((b) => {
        const casinoName = b.casino || b.brandName || b.title;
        const casinoSlug = casinoName
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || b.id;
        return casinoSlug === slug || b.id === slug;
      });
      
      if (firstBonus) {
        // Try to get casino by casinoId if available
        if (firstBonus.casinoId && typeof firstBonus.casinoId === 'string') {
          casino = await getCasinoById(firstBonus.casinoId);
        }
        
        // Get all bonuses for this casino/brand
        const brandName = firstBonus.casino || firstBonus.brandName || '';
        bonuses = allBonuses.filter((b) => {
          // If we found a casino, check by casinoId first
          if (casino && b.casinoId && typeof b.casinoId === 'string') {
            return b.casinoId === casino.id;
          }
          // Otherwise match by brandName
          const bonusBrandName = b.casino || b.brandName || '';
          if (bonusBrandName && brandName) {
            return bonusBrandName.toLowerCase().trim() === brandName.toLowerCase().trim();
          }
          return false;
        });
      }
    }
    
    return { casino, bonuses };
  } catch (error) {
    console.error("Error fetching casino data:", error);
    return { casino: null, bonuses: [] };
  }
}



export default async function CasinoReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const { casino, bonuses } = await getCasinoData(slug);

  if (!casino && bonuses.length === 0) {
    notFound();
  }

  const casinoName = casino?.name || bonuses[0]?.casino || bonuses[0]?.brandName || bonuses[0]?.title || 'Unknown Casino';
  const casinoLogo = casino?.logo || bonuses[0]?.image || '';
  const casinoWebsite = casino?.website || '';
  const casinoDescription = casino?.description || bonuses[0]?.description || '';

  // Fetch reviews from database
  let reviews: Array<{ id: string; name: string; seed: string; rating: number; text: string; timeAgo: string }> = [];
  let calculatedRating = casino?.rating ?? (bonuses[0]?.rating || 0);
  try {
    const casinoId = casino?.id || (bonuses[0]?.casinoId && typeof bonuses[0].casinoId === 'string' ? bonuses[0].casinoId : null);
    if (casinoId) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const reviewsResponse = await fetch(`${baseUrl}/api/reviews?casinoId=${casinoId}`, {
        cache: 'no-store'
      });
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        reviews = reviewsData.reviews || [];
        
        // Calculate average rating from reviews
        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
          calculatedRating = Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
        }
      }
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
  
  const casinoRating = calculatedRating;

  return (
    <div className="min-h-screen bg-background mt-16 sm:mt-20">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="max-w-full lg:max-w-[95%] 2xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 order-1">
              <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
                {casinoLogo ? (
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-transparent">
                    <Image
                      src={casinoLogo}
                      alt={`${casinoName} logo`}
                      fill
                      className="object-contain rounded-full"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{casinoName.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
                
                <h1 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4">{casinoName} Review</h1>

                {/* Rating from Reviews */}
                {reviews.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                            star <= Math.round(casinoRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{casinoRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                  </div>
                )}

                {casinoWebsite && (
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 mb-3 text-sm sm:text-base py-2.5 sm:py-2">
                    <a href={casinoWebsite} target="_blank" rel="noopener noreferrer">
                      Visit Casino
                      <ExternalLink className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                )}

                {casinoDescription && (
                  <div className="mt-6">
                    <div className="text-xs font-semibold mb-2">ABOUT:</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{casinoDescription}</p>
                  </div>
                )}

                <CollapsibleSection
                  title="PAYMENT METHODS"
                  items={casino?.paymentMethods || []}
                  initialShowCount={6}
                  variant="outline"
                />

                {/* Game Providers - Commented out for future use */}
                {/* <CollapsibleSection
                  title="GAME PROVIDERS"
                  items={casino?.gameProviders || []}
                  initialShowCount={8}
                  variant="secondary"
                /> */}

                {/* Game Types - Commented out for future use */}
                {/* <CollapsibleSection
                  title="GAME TYPES"
                  items={casino?.gameTypes || []}
                  initialShowCount={8}
                  variant="secondary"
                /> */}

                {/* Customer Support Options */}
                {casino?.supportMethods && casino.supportMethods.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-semibold mb-2">CUSTOMER SUPPORT:</div>
                    <div className="flex flex-wrap gap-2">
                      {casino.supportMethods.map((method, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{method}</Badge>
                      ))}
                      {casino.supportLiveChat && (
                        <Badge variant="secondary" className="text-xs">Live Chat</Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Middle Column - Reviews and Features */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 order-2">
              {/* User Reviews */}
              {reviews.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold">User Reviews</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 sm:pb-4 last:border-0">
                      <div className="flex items-start gap-2 sm:gap-4">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.seed)}`}
                          alt={`${review.name} avatar`}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm sm:text-base">{review.name}</span>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                    star <= review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 break-words">{review.text}</p>
                          <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Positives/Negatives */}
              {((casino?.positives && casino.positives.length > 0) || (casino?.negatives && casino.negatives.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {casino?.positives && casino.positives.length > 0 && (
                    <Card className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm">POSITIVES</h3>
                      </div>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                        {casino.positives.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                            <span className="text-green-600 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {casino?.negatives && casino.negatives.length > 0 && (
                    <Card className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm">NEGATIVES</h3>
                      </div>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                        {casino.negatives.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                            <span className="text-red-600 mt-0.5 sm:mt-1 flex-shrink-0">✗</span>
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Bonuses */}
            <div className="lg:col-span-3 order-3">
              {bonuses.length > 0 && (() => {
                // Group bonuses by their first tag
                const groupedBonuses: Record<string, Bonus[]> = {};
                bonuses.forEach((bonus) => {
                  const tag = bonus.tags && bonus.tags.length > 0 
                    ? bonus.tags[0].toLowerCase() 
                    : 'standard';
                  if (!groupedBonuses[tag]) {
                    groupedBonuses[tag] = [];
                  }
                  groupedBonuses[tag].push(bonus);
                });

                return <BonusTabs groupedBonuses={groupedBonuses} />;
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
