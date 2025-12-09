import { Bonus } from './data';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;

/**
 * Checks if a bonus is "working" (has valid link and title)
 */
function isWorkingBonus(bonus: Bonus): boolean {
  return !!(bonus.title && bonus.link && bonus.link !== '#' && bonus.link.startsWith('http'));
}

/**
 * Fetches bonuses from the backend API
 * Returns empty array if no bonuses are available
 */
export async function getBonuses(): Promise<Bonus[]> {
  // If no backend URL is configured, return empty array (no bonuses)
  if (!BACKEND_URL) {
    console.warn('⚠️ BACKEND_URL not configured');
    return [];
  }

  try {
    const response = await fetch(`${BACKEND_URL}/bonuses`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const rawBonuses: any[] = await response.json();
    
    console.log(`📥 Raw data from backend: ${rawBonuses.length} bonuses received`);
    console.log('📊 Raw bonus sample:', JSON.stringify(rawBonuses[0], null, 2));
    
    if (!rawBonuses || rawBonuses.length === 0) {
      console.warn('No bonuses returned from API');
      return [];
    }

    // Map backend fields to frontend structure
    const validatedBonuses = rawBonuses.map((bonus, index) => {
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
              // Try to extract the actual image URL from the page
              // For now, use a placeholder or try to construct the image URL
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
      const normalized = {
        id: bonus.id || bonus.brandName?.toLowerCase().replace(/\s+/g, '-') || `bonus-${index}`,
        title: bonus.welcomeBonus || bonus.title || bonus.brandName || 'Unknown Casino',
        description: bonus.bonusDetails || bonus.description || '',
        code: bonus.code,
        link: trackingLink,
        image: imageUrl,
        tags: Array.isArray(bonus.tags) ? bonus.tags : (bonus.tags ? [bonus.tags] : []),
        rating: typeof bonus.rating === 'number' ? bonus.rating : (bonus.rating ? parseFloat(bonus.rating) : 5),
        exclusive: bonus.exclusive,
        terms: bonus.terms || '18+. T&Cs apply.',
        wagering: bonus.wager || bonus.wagering,
        minDeposit: bonus.minDeposit,
        maxBonus: bonus.maxBonus,
      };
      
      // Log if any important fields are missing
      if (!bonus.welcomeBonus && !bonus.title) {
        console.warn(`⚠️ Bonus at index ${index} missing title/welcomeBonus`);
      }
      if (!bonus.bonusDetails && !bonus.description) {
        console.warn(`⚠️ Bonus at index ${index} missing description/bonusDetails`);
      }
      
      return normalized;
    });

    // Filter to only return working bonuses from backend
    const workingBackendBonuses = validatedBonuses.filter(isWorkingBonus);
    
    if (workingBackendBonuses.length === 0) {
      console.warn('No working bonuses returned from backend API');
      return [];
    }

    console.log(`✅ Successfully processed ${workingBackendBonuses.length} working bonuses from backend API`);
    console.log('📊 Validated bonus sample:', JSON.stringify(workingBackendBonuses[0], null, 2));
    return workingBackendBonuses;
  } catch (error) {
    console.error('❌ Error fetching bonuses from backend API:', error);
    console.warn('No bonuses available');
    return [];
  }
}

