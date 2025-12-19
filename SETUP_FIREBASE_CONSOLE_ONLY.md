# Setup Firestore to Google Sheets - Firebase Console Only (No Local Setup)

This guide shows you how to set up the integration entirely through Firebase Console and Google Sheets web interfaces - no local development needed!

## Step 1: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (same project ID)
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Sheets API"
5. Click **Enable**

## Step 2: Create Service Account

1. In Google Cloud Console, go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it: `firestore-to-sheets`
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

## Step 3: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the JSON file
6. **IMPORTANT:** Open this JSON file and note:
   - `client_email` - You'll need this email
   - `private_key` - You'll need this key (keep the \n characters)

## Step 4: Create Google Sheet

1. Create a new Google Sheet (or use existing)
2. **Get the Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```
   Copy the `SHEET_ID_HERE` part
3. **Set up headers** in Row 1:
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
4. **Share the Sheet:**
   - Click **Share** button
   - Add the service account email (from JSON file, field: `client_email`)
   - Give it **Editor** permissions
   - Click **Send**

## Step 5: Set Up Firebase Functions in Console

### 5.1 Enable Cloud Functions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Functions** in the left sidebar
4. If you see "Get started", click it to enable Functions
5. Accept the terms and enable billing (required for Cloud Functions)

### 5.2 Create the Function via Console

**Option A: Using Firebase Console Inline Editor (Recommended)**

1. In Firebase Console, go to **Functions**
2. Click **Create function** or **Add function**
3. Choose **Cloud Firestore trigger**
4. Configure:
   - **Function name**: `onNewsletterSubscribe`
   - **Region**: Choose closest to you (e.g., `us-central1`)
   - **Event type**: `Create`
   - **Document path**: `newsletter_subscribers/{subscriberId}`
5. Click **Save** or **Next**

**Note:** The inline editor in Firebase Console has limitations. You may need to use the alternative method below.

**Option B: Using Firebase Console + Cloud Shell (Better for complex code)**

1. In Firebase Console, go to **Functions**
2. Click the **</>** icon or **Open in Cloud Shell** (if available)
3. Or use the **Cloud Shell** directly:
   - Click the Cloud Shell icon (top right in Google Cloud Console)
   - This opens a browser-based terminal

### 5.3 Initialize Functions in Cloud Shell

If using Cloud Shell, run:

```bash
# Navigate to a temporary directory
mkdir -p ~/firebase-functions
cd ~/firebase-functions

# Initialize Firebase (if not already done)
firebase init functions

# Choose:
# - Use an existing project (select your Firebase project)
# - TypeScript
# - ESLint: No (to keep it simple)
# - Install dependencies: Yes
```

### 5.4 Create the Function Code

In Cloud Shell, edit `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

admin.initializeApp();

// Get configuration from environment variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '';
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL || '';
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY || '';

function getSheetsClient() {
  if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY) {
    throw new Error('Service account credentials not configured');
  }

  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export const onNewsletterSubscribe = functions.firestore
  .document('newsletter_subscribers/{subscriberId}')
  .onCreate(async (snap, context) => {
    const subscriber = snap.data();
    const subscriberId = context.params.subscriberId;

    try {
      const sheets = getSheetsClient();

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

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:K',
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
      return null;
    }
  });
```

### 5.5 Install Dependencies in Cloud Shell

```bash
cd functions
npm install googleapis
npm install --save-dev @types/node
cd ..
```

### 5.6 Set Environment Variables

In Cloud Shell, set the environment variables:

```bash
# Get these values from your service account JSON file:
# - client_email -> SERVICE_ACCOUNT_EMAIL
# - private_key -> SERVICE_ACCOUNT_KEY (keep the \n characters)

firebase functions:config:set \
  sheets.spreadsheet_id="YOUR_SHEET_ID_HERE" \
  sheets.service_account_email="your-service-account@project.iam.gserviceaccount.com" \
  sheets.service_account_key="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

**Important:** For the private key, you need to include the `\n` characters. Copy the entire private key from the JSON file including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts.

### 5.7 Deploy the Function

```bash
firebase deploy --only functions
```

## Alternative: Using Google Apps Script (Simpler, No Firebase Functions)

If you prefer not to use Cloud Functions, you can use Google Apps Script directly in your Google Sheet:

### Step 1: Open Apps Script

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Delete the default code

### Step 2: Add the Script

Paste this code (you'll need to set up Firebase Admin SDK separately, or use a webhook approach):

```javascript
// This is a simplified version - you'll need to set up Firebase Admin SDK
// Or use a webhook endpoint that your app calls

function onFormSubmit(e) {
  // This would be triggered by a form submission
  // You'd need to set up a webhook from your app to call this
}

// Manual sync function
function syncFromFirestore() {
  // You would need to:
  // 1. Set up Firebase Admin SDK in Apps Script (complex)
  // 2. Or create a webhook endpoint that your app calls
  // 3. Or use a scheduled trigger to poll an API endpoint
}
```

**Note:** Apps Script approach requires more setup for Firebase integration. The Cloud Functions approach is recommended.

## Step 6: Test the Integration

1. **Test automatic sync:**
   - Subscribe to the newsletter through your deployed app
   - Check your Google Sheet - a new row should appear automatically

2. **Check logs:**
   - In Firebase Console, go to **Functions** > **Logs**
   - Look for any errors or success messages

## Troubleshooting

### View Logs
- Firebase Console > **Functions** > **Logs**
- Filter by function name: `onNewsletterSubscribe`

### Common Issues

1. **Permission Denied**
   - Verify service account email has Editor access to the Sheet
   - Check the Sheet ID is correct

2. **Invalid Credentials**
   - Ensure private key includes `\n` characters
   - Verify service account JSON is valid

3. **Function Not Triggering**
   - Check that the collection name matches: `newsletter_subscribers`
   - Verify the document path pattern: `newsletter_subscribers/{subscriberId}`

## Summary

You can set up everything through:
- ✅ **Google Cloud Console** - For API and service account setup
- ✅ **Firebase Console** - For enabling Functions
- ✅ **Cloud Shell** - For writing and deploying code (browser-based, no local setup)
- ✅ **Google Sheets** - For the destination sheet

No local development environment needed! 🎉

