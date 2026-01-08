import { collection, getDocs, getDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { db } from './config';
import { Casino } from '../data';
import { processImageUrl } from '../utils/image-utils';

const COLLECTION_NAME = 'casinos';

/**
 * Fetches all casinos from Firestore
 */
export async function getCasinosFromFirestore(): Promise<Casino[]> {
  try {
    const casinosRef = collection(db, COLLECTION_NAME);
    const q = query(casinosRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('No casinos found in Firestore');
      return [];
    }

    const casinos: Casino[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Process logo URL if available
      const logoUrl = data.logo ? processImageUrl(data.logo) : undefined;

      // Generate slug from name if not provided
      const slug = data.slug || (data.name 
        ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : doc.id);

      return {
        id: doc.id,
        name: data.name || 'Unknown Casino',
        slug,
        logo: logoUrl,
        description: data.description || '',
        rating: typeof data.rating === 'number' ? data.rating : (data.rating ? parseFloat(data.rating) : undefined),
        website: data.website || '',
        ...data, // Include any additional fields
      };
    });

    console.log(`✅ Successfully fetched ${casinos.length} casinos from Firestore`);
    return casinos;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching casinos from Firestore:', errorMessage);
    throw new Error(`Failed to fetch casinos from Firestore: ${errorMessage}`);
  }
}

/**
 * Fetches a single casino by ID
 */
export async function getCasinoById(casinoId: string): Promise<Casino | null> {
  try {
    const casinoRef = doc(db, COLLECTION_NAME, casinoId);
    const casinoDoc = await getDoc(casinoRef);

    if (!casinoDoc.exists()) {
      return null;
    }

    const data = casinoDoc.data();
    const logoUrl = data.logo ? processImageUrl(data.logo) : undefined;

    const slug = data.slug || (data.name 
      ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : casinoId);

    return {
      id: casinoDoc.id,
      name: data.name || 'Unknown Casino',
      slug,
      logo: logoUrl,
      description: data.description || '',
      rating: typeof data.rating === 'number' ? data.rating : (data.rating ? parseFloat(data.rating) : undefined),
      website: data.website || '',
      ...data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error fetching casino ${casinoId} from Firestore:`, errorMessage);
    throw new Error(`Failed to fetch casino from Firestore: ${errorMessage}`);
  }
}

/**
 * Fetches a casino by slug
 */
export async function getCasinoBySlug(slug: string): Promise<Casino | null> {
  try {
    const casinosRef = collection(db, COLLECTION_NAME);
    const q = query(casinosRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Try to find by name match (fallback)
      const allCasinos = await getCasinosFromFirestore();
      return allCasinos.find(c => c.slug === slug) || null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const logoUrl = data.logo ? processImageUrl(data.logo) : undefined;

    return {
      id: doc.id,
      name: data.name || 'Unknown Casino',
      slug: data.slug || slug,
      logo: logoUrl,
      description: data.description || '',
      rating: typeof data.rating === 'number' ? data.rating : (data.rating ? parseFloat(data.rating) : undefined),
      website: data.website || '',
      ...data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error fetching casino by slug ${slug} from Firestore:`, errorMessage);
    throw new Error(`Failed to fetch casino from Firestore: ${errorMessage}`);
  }
}

