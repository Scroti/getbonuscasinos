import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'newsletter_subscribers';

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  country?: string;
  countryCode?: string;
  timezone?: string;
  language?: string;
  userAgent?: string;
  deviceType?: string;
  referrer?: string;
  screenResolution?: string;
}

export interface UserProfileData {
  country?: string;
  countryCode?: string;
  timezone?: string;
  language?: string;
  userAgent?: string;
  deviceType?: string;
  referrer?: string;
  screenResolution?: string;
}

/**
 * Checks if an email is already subscribed
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', normalizedEmail)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking email subscription:', error);
    throw error;
  }
}

/**
 * Detects user country and other profile data
 */
export async function getUserProfileData(): Promise<UserProfileData> {
  const profileData: UserProfileData = {};

  try {
    // Get timezone
    profileData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get language
    profileData.language = navigator.language || navigator.languages?.[0] || 'en';

    // Get user agent
    profileData.userAgent = navigator.userAgent;

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      profileData.deviceType = 'mobile';
    } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      profileData.deviceType = 'tablet';
    } else {
      profileData.deviceType = 'desktop';
    }

    // Get screen resolution
    profileData.screenResolution = `${window.screen.width}x${window.screen.height}`;

    // Get referrer
    profileData.referrer = document.referrer || 'direct';

    // Get country using IP geolocation (free service)
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        profileData.country = ipData.country_name || '';
        profileData.countryCode = ipData.country_code || '';
      }
    } catch (ipError) {
      // Fallback: try alternative service
      try {
        const altResponse = await fetch('https://ip-api.com/json/?fields=country,countryCode');
        if (altResponse.ok) {
          const altData = await altResponse.json();
          profileData.country = altData.country || '';
          profileData.countryCode = altData.countryCode || '';
        }
      } catch (altError) {
        console.warn('Could not detect country:', altError);
      }
    }
  } catch (error) {
    console.warn('Error collecting user profile data:', error);
  }

  return profileData;
}

/**
 * Subscribes an email to the newsletter with user profile data
 * Returns true if successfully subscribed, false if already subscribed
 */
export async function subscribeToNewsletter(
  email: string,
  profileData?: UserProfileData
): Promise<{ success: boolean; alreadySubscribed: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return {
        success: false,
        alreadySubscribed: false,
        error: 'Invalid email format',
      };
    }

    // Check if email is already subscribed
    const alreadySubscribed = await isEmailSubscribed(normalizedEmail);
    if (alreadySubscribed) {
      return {
        success: false,
        alreadySubscribed: true,
      };
    }

    // Get user profile data if not provided
    const userProfile = profileData || await getUserProfileData();

    // Add new subscriber with profile data
    await addDoc(collection(db, COLLECTION_NAME), {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      ...userProfile, // Spread all profile data
    });

    return {
      success: true,
      alreadySubscribed: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error subscribing to newsletter:', errorMessage);
    return {
      success: false,
      alreadySubscribed: false,
      error: errorMessage,
    };
  }
}

