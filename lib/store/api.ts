import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Bonus } from '../data';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/**
 * Checks if a bonus is "working" (has valid link and title)
 */
function isWorkingBonus(bonus: Bonus): boolean {
  return !!(bonus.title && bonus.link && bonus.link !== '#' && bonus.link.startsWith('http'));
}

/**
 * Transform raw bonus data from backend to frontend structure
 */
function transformBonus(bonus: any, index: number): Bonus {
  // Extract image URL from Google redirect if needed
  let imageUrl = bonus.logo || bonus.image || '/placeholder.png';
  
  // Handle Google redirect URLs - extract actual image URL
  if (imageUrl && imageUrl.includes('www.google.com')) {
    try {
      const url = new URL(imageUrl);
      const urlParam = url.searchParams.get('url');
      if (urlParam) {
        // Decode the URL parameter
        imageUrl = decodeURIComponent(urlParam);
        // Extract from casinobankingmethods.com or other domains
        if (imageUrl.includes('casinobankingmethods.com')) {
          imageUrl = '/placeholder.png';
        }
      }
    } catch (e) {
      console.error('Error parsing Google redirect URL:', e);
      imageUrl = '/placeholder.png';
    }
  }
  
  // Handle imgurl parameter (older Google redirect format)
  if (imageUrl && imageUrl.includes('imgurl=')) {
    try {
      const urlParams = new URLSearchParams(new URL(imageUrl).search);
      const imgUrl = urlParams.get('imgurl');
      if (imgUrl) {
        imageUrl = decodeURIComponent(imgUrl);
      }
    } catch (e) {
      console.error('Error parsing image URL:', e);
    }
  }

  // Ensure tracking link has protocol
  let trackingLink = bonus.trackingLink || bonus.link || '#';
  if (trackingLink && !trackingLink.startsWith('http')) {
    trackingLink = `https://${trackingLink}`;
  }

  // Map backend structure to frontend structure
  return {
    id: bonus.id || bonus.brandName?.toLowerCase().replace(/\s+/g, '-') || `bonus-${index}`,
    title: bonus.welcomeBonus || bonus.title || bonus.brandName || 'Unknown Casino',
    description: bonus.bonusDetails || bonus.description || '',
    code: bonus.code,
    link: trackingLink,
    image: imageUrl,
    tags: Array.isArray(bonus.tags) 
      ? bonus.tags.map((tag: any) => typeof tag === 'string' ? tag.trim() : String(tag).trim()).filter(Boolean)
      : (bonus.tags ? [String(bonus.tags).trim()] : []),
    rating: typeof bonus.rating === 'number' ? bonus.rating : (bonus.rating ? parseFloat(bonus.rating) : 5),
    exclusive: bonus.exclusive,
    terms: bonus.terms || '18+. T&Cs apply.',
    wagering: bonus.wager || bonus.wagering,
    minDeposit: bonus.minDeposit,
    maxBonus: bonus.maxBonus,
  };
}

// Custom baseQuery that handles missing BACKEND_URL
const baseQueryWithFallback = async (args: any, api: any, extraOptions: any) => {
  if (!BACKEND_URL) {
    console.warn('⚠️ BACKEND_URL not configured');
    return { data: [] };
  }
  
  const baseQuery = fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });
  
  return baseQuery(args, api, extraOptions);
};

// Define the API slice
export const bonusesApi = createApi({
  reducerPath: 'bonusesApi',
  baseQuery: baseQueryWithFallback,
  tagTypes: ['Bonuses'],
  endpoints: (builder) => ({
    getBonuses: builder.query<Bonus[], void>({
      query: () => '/bonuses',
      transformResponse: (response: any[]): Bonus[] => {
        if (!response || !Array.isArray(response) || response.length === 0) {
          console.warn('No bonuses returned from API');
          return [];
        }

        console.log(`📥 Raw data from backend: ${response.length} bonuses received`);
        
        // Map and transform bonuses
        const validatedBonuses = response.map((bonus, index) => {
          // Log if any important fields are missing
          if (!bonus.welcomeBonus && !bonus.title) {
            console.warn(`⚠️ Bonus at index ${index} missing title/welcomeBonus`);
          }
          if (!bonus.bonusDetails && !bonus.description) {
            console.warn(`⚠️ Bonus at index ${index} missing description/bonusDetails`);
          }
          
          return transformBonus(bonus, index);
        });

        // Filter to only return working bonuses
        const workingBonuses = validatedBonuses.filter(isWorkingBonus);
        
        if (workingBonuses.length === 0) {
          console.warn('No working bonuses returned from backend API');
          return [];
        }

        console.log(`✅ Successfully processed ${workingBonuses.length} working bonuses from backend API`);
        if (workingBonuses.length > 0) {
          console.log('📊 Validated bonus sample:', JSON.stringify(workingBonuses[0], null, 2));
        }
        
        return workingBonuses;
      },
      transformErrorResponse: (response: any): Bonus[] => {
        console.error('❌ Error fetching bonuses from backend API:', response);
        return [];
      },
    }),
  }),
});

export const { useGetBonusesQuery } = bonusesApi;

