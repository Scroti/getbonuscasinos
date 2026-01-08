import { collection, getDocs, query, doc, getDoc, DocumentReference } from 'firebase/firestore';
import { db } from './config';
import { Bonus } from '../data';
import { processImageUrl } from '../utils/image-utils';
import { getCasinoById } from './casinos';

const COLLECTION_NAME = 'bonuses';

/**
 * Fetches all bonuses from Firestore
 */
export async function getBonusesFromFirestore(): Promise<Bonus[]> {
  try {
    const bonusesRef = collection(db, COLLECTION_NAME);
    // Note: Can't order by brandName if it's a Firestore reference, so we'll sort in memory
    const q = query(bonusesRef);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No bonuses found in Firestore');
      return [];
    }

    // Process bonuses and resolve casino references
    const bonusesPromises = snapshot.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data();
      
      // Parse tags from comma-separated string to array (same as backend)
      const tagsString = data.tags || '';
      const tags = tagsString
        ? tagsString
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : [];

      // Process image URL (handles Google Drive, redirects, etc.)
      const imageUrl = processImageUrl(data.logo || data.image || '/placeholder.png');

      // Ensure tracking link has protocol
      let trackingLink = data.trackingLink || data.link || '#';
      if (trackingLink && !trackingLink.startsWith('http')) {
        trackingLink = `https://${trackingLink}`;
      }

      // Handle brandName - can be a string, reference, or casinoId
      let brandName = '';
      let casinoId = '';
      
      // Check if brandName is a Firestore DocumentReference
      if (data.brandName) {
        if (data.brandName instanceof DocumentReference || (data.brandName.path && data.brandName.id)) {
          // It's a reference
          const ref = data.brandName as DocumentReference;
          casinoId = ref.id;
          try {
            const casinoDoc = await getDoc(ref);
            if (casinoDoc.exists()) {
              brandName = casinoDoc.data().name || '';
            }
          } catch (error) {
            console.warn(`Failed to resolve casino reference for bonus ${docSnapshot.id}:`, error);
          }
        } else if (typeof data.brandName === 'string') {
          // It's a string (legacy)
          brandName = data.brandName;
        }
      }
      
      // Also check casinoId/casinoRef fields
      if (!casinoId) {
        casinoId = data.casinoId || data.casinoRef || '';
      }
      
      // Fallback to casino field if brandName is still empty
      if (!brandName) {
        brandName = data.casino || '';
      }
      
      return {
        id: data.id || docSnapshot.id,
        title: data.welcomeBonus || data.title || brandName || 'Unknown Casino',
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
        casino: brandName, // Legacy field
        brandName: brandName, // Legacy field
        casinoId: casinoId, // Reference to casino document
        order: data.order !== undefined ? data.order : Number.MAX_SAFE_INTEGER, // Order field for sorting
      };
    });

    let bonuses = await Promise.all(bonusesPromises);
    
    // Sort bonuses by order field first, then by casino name or title
    bonuses.sort((a, b) => {
      const orderA = (a as any).order ?? Number.MAX_SAFE_INTEGER;
      const orderB = (b as any).order ?? Number.MAX_SAFE_INTEGER;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Fallback to sorting by casino name or title
      const nameA = a.brandName || a.casino || a.title || '';
      const nameB = b.brandName || b.casino || b.title || '';
      return nameA.localeCompare(nameB);
    });

    console.log(`✅ Successfully fetched ${bonuses.length} bonuses from Firestore`);
    return bonuses;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching bonuses from Firestore:', errorMessage);
    throw new Error(`Failed to fetch bonuses from Firestore: ${errorMessage}`);
  }
}

