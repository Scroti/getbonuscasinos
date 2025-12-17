# Firestore to Google Sheets Cloud Function Setup

This guide explains how to create a Firebase Cloud Function that automatically syncs newsletter subscribers from Firestore to Google Sheets.

## Prerequisites

1. Firebase project with Firestore enabled
2. Google Cloud project (same as Firebase)
3. Google Sheets API enabled
4. Service account with Sheets API access

## Step 1: Set Up Google Sheets API

### 1.1 Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Sheets API"
5. Click **Enable**

### 1.2 Create a Service Account
1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., `firestore-to-sheets`)
4. Click **Create and Continue**
5. Skip role assignment (or add "Editor" if needed)
6. Click **Done**

### 1.3 Create and Download Key
1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the JSON file (keep it secure!)

### 1.4 Share Google Sheet with Service Account
1. Create a new Google Sheet or use an existing one
2. Note the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Click **Share** button
4. Add the service account email (from the JSON file, field: `client_email`)
5. Give it **Editor** permissions
6. Click **Send**

## Step 2: Create Firebase Cloud Function

### 2.1 Initialize Functions (if not already done)

```bash
cd your-project-root
firebase init functions
```

Choose:
- TypeScript
- ESLint (optional)
- Install dependencies: Yes

### 2.2 Install Required Dependencies

```bash
cd functions
npm install googleapis
npm install --save-dev @types/node
```

### 2.3 Create the Cloud Function

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

admin.initializeApp();

// Configuration - Set these in Firebase Functions config
const SPREADSHEET_ID = functions.config().sheets?.spreadsheet_id || 'YOUR_SHEET_ID';
const SERVICE_ACCOUNT_EMAIL = functions.config().sheets?.service_account_email || 'YOUR_SERVICE_ACCOUNT_EMAIL';
const SERVICE_ACCOUNT_KEY = functions.config().sheets?.service_account_key || 'YOUR_PRIVATE_KEY';

/**
 * Initialize Google Sheets API client
 */
function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Cloud Function triggered when a new subscriber is added
 */
export const onNewsletterSubscribe = functions.firestore
  .document('newsletter_subscribers/{subscriberId}')
  .onCreate(async (snap, context) => {
    const subscriber = snap.data();
    const subscriberId = context.params.subscriberId;

    try {
      const sheets = getSheetsClient();

      // Prepare row data with all profile fields
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
        subscriberId,
      ];

      // Append row to sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:K', // Adjust range as needed (11 columns)
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
      throw error;
    }
  });

/**
 * Optional: Function to sync all existing subscribers (one-time setup)
 */
export const syncAllSubscribers = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const subscribersSnapshot = await db.collection('newsletter_subscribers').get();
    const sheets = getSheetsClient();

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await sheets.spreadsheets.values.clear({
    //   spreadsheetId: SPREADSHEET_ID,
    //   range: 'Sheet1!A2:D', // Keep header row
    // });

    // Prepare header row (if sheet is empty)
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
        doc.id,
      ]);
    });

    // Write all data at once
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
      message: `Synced ${rows.length} subscribers to Google Sheets` 
    });
  } catch (error) {
    console.error('Error syncing subscribers:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});
```

### 2.4 Set Up Google Sheet Headers

In your Google Sheet, create headers in row 1:
- Column A: `Email`
- Column B: `Subscribed At`
- Column C: `Country`
- Column D: `Country Code`
- Column E: `Timezone`
- Column F: `Language`
- Column G: `Device Type`
- Column H: `Screen Resolution`
- Column I: `Referrer`
- Column J: `User Agent`
- Column K: `Document ID`

### 2.5 Configure Function Environment Variables

Set the configuration using Firebase CLI:

```bash
# Extract values from your service account JSON file
# client_email -> SERVICE_ACCOUNT_EMAIL
# private_key -> SERVICE_ACCOUNT_KEY (keep the \n characters)

firebase functions:config:set \
  sheets.spreadsheet_id="YOUR_SHEET_ID_HERE" \
  sheets.service_account_email="your-service-account@project.iam.gserviceaccount.com" \
  sheets.service_account_key="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

**Important:** The private key must include the `\n` characters. You can escape them or use the full key with newlines.

### 2.6 Deploy the Function

```bash
firebase deploy --only functions
```

## Step 3: Test the Function

### 3.1 Test Automatic Sync
1. Subscribe to the newsletter through your app
2. Check your Google Sheet - a new row should appear automatically

### 3.2 Test Manual Sync (Optional)
Call the sync function:
```bash
# Get the function URL from Firebase Console
curl https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/syncAllSubscribers
```

Or visit the URL in your browser.

## Step 4: Monitor and Troubleshoot

### View Logs
```bash
firebase functions:log
```

Or in Firebase Console:
1. Go to **Functions** > **Logs**
2. Filter by function name

### Common Issues

1. **Permission Denied**
   - Make sure service account email has Editor access to the Sheet
   - Verify the Sheet ID is correct

2. **Invalid Credentials**
   - Check that the private key includes `\n` characters
   - Verify service account JSON is valid

3. **Sheet Not Found**
   - Verify the Sheet ID in the URL
   - Make sure the Sheet is shared with the service account

## Security Best Practices

1. **Never commit service account keys to git**
   - Add `functions/service-account-key.json` to `.gitignore`
   - Use Firebase Functions config for secrets

2. **Use Environment-Specific Sheets**
   - Create separate sheets for dev/prod
   - Use different config values per environment

3. **Limit Service Account Permissions**
   - Only give Editor access to the specific Sheet
   - Don't give project-wide permissions

## Alternative: Using Google Apps Script

If you prefer not to use Cloud Functions, you can use Google Apps Script:

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Create a script that:
   - Reads from Firestore (requires Firebase Admin SDK setup)
   - Or uses a webhook endpoint
   - Writes to the current sheet

This approach is simpler but less real-time than Cloud Functions.

## Support

For issues or questions:
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Firebase Community](https://firebase.google.com/support)

