# Simplest Solution: Google Apps Script + Webhook

This is the **easiest** way to sync Firestore to Google Sheets without any local setup or Cloud Functions!

## How It Works

Instead of using Cloud Functions, we'll:
1. Create a simple webhook endpoint in Google Apps Script
2. Call this webhook from your Next.js app when a subscriber is added
3. The script writes directly to your Google Sheet

## Step 1: Create Google Sheet

1. Create a new Google Sheet
2. **Set up headers** in Row 1:
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

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete the default code
3. Paste this code:

```javascript
/**
 * Webhook endpoint to receive subscriber data from your app
 * This function will be called via HTTP POST from your Next.js app
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare row data
    const rowData = [
      data.email || '',
      data.subscribedAt || new Date().toISOString(),
      data.country || '',
      data.countryCode || '',
      data.timezone || '',
      data.language || '',
      data.deviceType || '',
      data.screenResolution || '',
      data.referrer || '',
      data.userAgent || '',
      data.documentId || '',
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Subscriber added to sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - you can run this manually to test
 */
function testWebhook() {
  const testData = {
    email: 'test@example.com',
    subscribedAt: new Date().toISOString(),
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/New_York',
    language: 'en',
    deviceType: 'desktop',
    screenResolution: '1920x1080',
    referrer: 'https://example.com',
    userAgent: 'Mozilla/5.0...',
    documentId: 'test123'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
```

## Step 3: Deploy as Web App

1. In Apps Script, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to **Select type**
3. Choose **Web app**
4. Configure:
   - **Description**: "Newsletter subscriber webhook"
   - **Execute as**: Me (your account)
   - **Who has access**: Anyone (or "Anyone with Google account" if you want to restrict)
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this in the next step
7. Click **Authorize access** and grant permissions

## Step 4: Update Your Next.js App

You need to call this webhook when a subscriber is added. Update `lib/firebase/newsletter.ts`:

```typescript
// Add this at the top of the file
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || '';

// Update the subscribeToNewsletter function to call the webhook
export async function subscribeToNewsletter(
  email: string,
  profileData?: UserProfileData
): Promise<{ success: boolean; alreadySubscribed: boolean; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // ... existing validation and subscription code ...

    // Add new subscriber with profile data
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      ...userProfile,
    });

    // Call Google Sheets webhook (don't wait for it - fire and forget)
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          subscribedAt: new Date().toISOString(),
          country: userProfile.country,
          countryCode: userProfile.countryCode,
          timezone: userProfile.timezone,
          language: userProfile.language,
          deviceType: userProfile.deviceType,
          screenResolution: userProfile.screenResolution,
          referrer: userProfile.referrer,
          userAgent: userProfile.userAgent,
          documentId: docRef.id,
        }),
      }).catch(error => {
        console.warn('Failed to sync to Google Sheets:', error);
        // Don't fail the subscription if webhook fails
      });
    }

    return {
      success: true,
      alreadySubscribed: false,
    };
  } catch (error) {
    // ... existing error handling ...
  }
}
```

## Step 5: Set Environment Variable

In your Amplify environment variables (or `.env.local`):

```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the ID from your deployed web app URL.

## Step 6: Deploy to Amplify

1. Commit the changes
2. Push to git
3. Amplify will automatically deploy
4. Make sure to add the environment variable in Amplify Console:
   - Go to **App settings** > **Environment variables**
   - Add: `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` with your webhook URL

## Testing

1. Subscribe to the newsletter through your app
2. Check your Google Sheet - a new row should appear
3. Check Apps Script logs: **Executions** in Apps Script editor

## Advantages of This Approach

✅ **No Cloud Functions needed** - Everything runs in Google Apps Script  
✅ **No local setup** - All done through web interfaces  
✅ **Simple** - Just a webhook endpoint  
✅ **Free** - Google Apps Script has generous free tier  
✅ **Easy to debug** - View logs directly in Apps Script  

## Security Note

The webhook URL is public, but you can add authentication:

```javascript
function doPost(e) {
  // Add a secret token check
  const authToken = e.parameter.token;
  if (authToken !== 'YOUR_SECRET_TOKEN') {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // ... rest of the code ...
}
```

Then include the token in your webhook URL or as a parameter.

## Troubleshooting

- **No data appearing**: Check Apps Script execution logs
- **Permission errors**: Make sure you authorized the web app
- **CORS issues**: Google Apps Script handles CORS automatically for web apps
- **Timeout**: Apps Script has a 6-minute execution limit (should be fine for this)

