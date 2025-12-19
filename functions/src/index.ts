import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

admin.initializeApp();

// Configuration - Set these in Firebase Functions config
// Get these values using: firebase functions:config:get
const SPREADSHEET_ID = functions.config().sheets?.spreadsheet_id || '';
const SERVICE_ACCOUNT_EMAIL = functions.config().sheets?.service_account_email || '';
const SERVICE_ACCOUNT_KEY = functions.config().sheets?.service_account_key || '';

/**
 * Initialize Google Sheets API client
 */
function getSheetsClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY) {
    throw new Error('Service account credentials not configured. Please set Firebase Functions config.');
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Cloud Function triggered when a new subscriber is added to Firestore
 * This automatically syncs new subscribers to Google Sheets
 */
export const onNewsletterSubscribe = functions.firestore
  .document('newsletter_subscribers/{subscriberId}')
  .onCreate(async (snap, context) => {
    const subscriber = snap.data();
    const subscriberId = context.params.subscriberId;

    try {
      const sheets = getSheetsClient();

      // Prepare row data matching the structure from newsletter.ts
      const rowData = [
        subscriber.email || '',
        subscriber.subscribedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        subscriber.country || '',
        subscriber.countryCode || '',
        subscriber.timezone || '',
        subscriber.language || '',
        subscriber.deviceType || '',
        subscriber.screenResolution || '',
        subscriber.referrer || '',
        subscriber.userAgent || '',
        subscriberId, // Document ID from Firestore
      ];

      // Append row to sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:K', // 11 columns: Email, Subscribed At, Country, Country Code, Timezone, Language, Device Type, Screen Resolution, Referrer, User Agent, Document ID
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowData],
        },
      });

      console.log(`✅ Added subscriber ${subscriber.email} to Google Sheets`);
      return null;
    } catch (error) {
      console.error('❌ Error adding subscriber to Google Sheets:', error);
      // Don't throw - we don't want to fail the subscription if Sheets sync fails
      return null;
    }
  });

/**
 * Optional: HTTP function to sync all existing subscribers (one-time setup)
 * Call this URL to sync all existing subscribers to Google Sheets
 * 
 * Usage: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/syncAllSubscribers
 */
export const syncAllSubscribers = functions.https.onRequest(async (req, res) => {
  // Optional: Add authentication check here
  // if (req.headers.authorization !== 'Bearer YOUR_SECRET_TOKEN') {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    const db = admin.firestore();
    const subscribersSnapshot = await db.collection('newsletter_subscribers').get();
    const sheets = getSheetsClient();

    if (subscribersSnapshot.empty) {
      return res.json({ 
        success: true, 
        message: 'No subscribers found in Firestore',
        count: 0
      });
    }

    // Prepare header row
    const headerRow = [[
      'Email', 
      'Subscribed At', 
      'Country', 
      'Country Code', 
      'Timezone', 
      'Language', 
      'Device Type', 
      'Screen Resolution', 
      'Referrer', 
      'User Agent', 
      'Document ID'
    ]];
    
    // Get all subscriber data
    const rows: any[] = [];
    subscribersSnapshot.forEach((doc) => {
      const data = doc.data();
      rows.push([
        data.email || '',
        data.subscribedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        data.country || '',
        data.countryCode || '',
        data.timezone || '',
        data.language || '',
        data.deviceType || '',
        data.screenResolution || '',
        data.referrer || '',
        data.userAgent || '',
        doc.id, // Document ID
      ]);
    });

    // Write all data at once (header + rows)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [...headerRow, ...rows],
      },
    });

    res.json({ 
      success: true, 
      message: `Synced ${rows.length} subscribers to Google Sheets`,
      count: rows.length
    });
  } catch (error) {
    console.error('❌ Error syncing subscribers:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to sync subscribers to Google Sheets'
    });
  }
});

