import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import { Bonus } from '../data';

const COLLECTION_NAME = 'bonuses';

/**
 * Fetches all bonuses from Firestore
 */
export async function getBonusesFromFirestore(): Promise<Bonus[]> {
  try {
    const bonusesRef = collection(db, COLLECTION_NAME);
    const q = query(bonusesRef, orderBy('brandName', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No bonuses found in Firestore');
      return [];
    }

    const bonuses: Bonus[] = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      
      // Parse tags from comma-separated string to array (same as backend)
      const tagsString = data.tags || '';
      const tags = tagsString
        ? tagsString
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : [];

      // Extract image URL from Google redirect if needed
      let imageUrl = data.logo || data.image || '/placeholder.png';
      
      // Handle Google redirect URLs
      if (imageUrl && imageUrl.includes('www.google.com')) {
        try {
          const url = new URL(imageUrl);
          const urlParam = url.searchParams.get('url');
          if (urlParam) {
            imageUrl = decodeURIComponent(urlParam);
            if (imageUrl.includes('casinobankingmethods.com')) {
              imageUrl = '/placeholder.png';
            }
          }
        } catch (e) {
          console.error('Error parsing Google redirect URL:', e);
          imageUrl = '/placeholder.png';
        }
      }

      // Handle imgurl parameter
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
      let trackingLink = data.trackingLink || data.link || '#';
      if (trackingLink && !trackingLink.startsWith('http')) {
        trackingLink = `https://${trackingLink}`;
      }

      // Map Firestore data to frontend Bonus structure
      return {
        id: data.id || doc.id,
        title: data.welcomeBonus || data.title || data.brandName || 'Unknown Casino',
        description: data.bonusDetails || data.description || '',
        code: data.code || '',
        link: trackingLink,
        image: imageUrl,
        tags,
        rating: typeof data.rating === 'number' ? data.rating : (data.rating ? parseFloat(data.rating) : 5),
        exclusive: data.exclusive || false,
        terms: data.terms || '18+. T&Cs apply.',
        wagering: data.wager || data.wagering || '',
        minDeposit: data.minDeposit || '',
        maxBonus: data.maxBonus || '',
      };
    });

    console.log(`✅ Successfully fetched ${bonuses.length} bonuses from Firestore`);
    return bonuses;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching bonuses from Firestore:', errorMessage);
    throw new Error(`Failed to fetch bonuses from Firestore: ${errorMessage}`);
  }
}

