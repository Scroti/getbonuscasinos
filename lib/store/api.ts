import { createApi } from '@reduxjs/toolkit/query/react';
import { Bonus } from '../data';
import { getBonusesFromFirestore } from '../firebase/firestore';

/**
 * Checks if a bonus is "working" (has valid link and title)
 */
function isWorkingBonus(bonus: Bonus): boolean {
  return !!(bonus.title && bonus.link && bonus.link !== '#' && bonus.link.startsWith('http'));
}

// Define the API slice
export const bonusesApi = createApi({
  reducerPath: 'bonusesApi',
  baseQuery: async () => ({ data: [] }), // Dummy baseQuery since we use queryFn
  tagTypes: ['Bonuses'],
  endpoints: (builder) => ({
    getBonuses: builder.query<Bonus[], void>({
      queryFn: async () => {
        try {
          const bonuses = await getBonusesFromFirestore();
          const workingBonuses = bonuses.filter(isWorkingBonus);
          
          if (workingBonuses.length === 0) {
            console.warn('No working bonuses returned from Firestore');
            return { data: [] };
          }

          // Sort bonuses by order field first, then by ID as fallback
          const sortedBonuses = workingBonuses.sort((a, b) => {
            const orderA = (a as any).order ?? Number.MAX_SAFE_INTEGER;
            const orderB = (b as any).order ?? Number.MAX_SAFE_INTEGER;
            
            if (orderA !== orderB) {
              return orderA - orderB;
            }
            
            // Fallback to sorting by ID
            if (!a.id) return 1;
            if (!b.id) return -1;
            return a.id.localeCompare(b.id);
          });

          console.log(`✅ Successfully processed ${sortedBonuses.length} working bonuses from Firestore`);
          return { data: sortedBonuses };
        } catch (error) {
          console.error('❌ Error fetching bonuses from Firestore:', error);
          return { data: [] };
        }
      },
    }),
  }),
});

export const { useGetBonusesQuery } = bonusesApi;

