import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'newsletter_subscribers';

export type SubscriberStatus = 'pending' | 'active';

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

export interface SubscriberRecord extends UserProfileData {
  email: string;
  status: SubscriberStatus;
  subscribedAt: Timestamp;
  confirmedAt: Timestamp | null;
  confirmationToken: string | null;
  tokenExpiresAt: Timestamp | null;
  domain?: string;
}

export interface SubscriberDoc {
  id: string;
  data: SubscriberRecord;
}

/**
 * Detects user country and other profile data (browser-side only)
 */
export async function getUserProfileData(): Promise<UserProfileData> {
  const profileData: UserProfileData = {};

  try {
    profileData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    profileData.language = navigator.language || navigator.languages?.[0] || 'en';
    profileData.userAgent = navigator.userAgent;

    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      profileData.deviceType = 'mobile';
    } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      profileData.deviceType = 'tablet';
    } else {
      profileData.deviceType = 'desktop';
    }

    profileData.screenResolution = `${window.screen.width}x${window.screen.height}`;
    profileData.referrer = document.referrer || 'direct';

    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        profileData.country = ipData.country_name || '';
        profileData.countryCode = ipData.country_code || '';
      }
    } catch {
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

export async function findSubscriberByEmail(email: string): Promise<SubscriberDoc | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const q = query(collection(db, COLLECTION_NAME), where('email', '==', normalizedEmail));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, data: docSnap.data() as SubscriberRecord };
}

export async function findSubscriberByToken(token: string): Promise<SubscriberDoc | null> {
  const q = query(collection(db, COLLECTION_NAME), where('confirmationToken', '==', token));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, data: docSnap.data() as SubscriberRecord };
}

export async function createPendingSubscriber(params: {
  email: string;
  token: string;
  expiresAt: Date;
  domain: string;
  profileData?: UserProfileData;
}): Promise<void> {
  const { email, token, expiresAt, domain, profileData } = params;
  await addDoc(collection(db, COLLECTION_NAME), {
    email: email.toLowerCase().trim(),
    status: 'pending' as SubscriberStatus,
    subscribedAt: serverTimestamp(),
    confirmedAt: null,
    confirmationToken: token,
    tokenExpiresAt: Timestamp.fromDate(expiresAt),
    domain,
    ...(profileData || {}),
  });
}

export async function updateSubscriberToken(
  docId: string,
  token: string,
  expiresAt: Date
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, docId), {
    confirmationToken: token,
    tokenExpiresAt: Timestamp.fromDate(expiresAt),
  });
}

export async function activateSubscriber(docId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, docId), {
    status: 'active' as SubscriberStatus,
    confirmedAt: serverTimestamp(),
  });
}

/**
 * Unsubscribes an email by deleting it from Firestore.
 * Works for both pending and active subscribers.
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<'success' | 'not-found' | 'error'> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', normalizedEmail)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 'not-found';
    }

    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    return 'success';
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return 'error';
  }
}
