# Quick Start: Firestore to Google Sheets Setup

This guide will help you set up automatic syncing of newsletter subscribers from Firestore to Google Sheets.

## Prerequisites Checklist

- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Node.js installed (v18 or higher)
- [ ] Firebase CLI installed

## Step 1: Install Firebase CLI

If you don't have Firebase CLI installed:

```bash
npm install -g firebase-tools
```

Then login:
```bash
firebase login
```

## Step 2: Initialize Firebase Functions

In your project root directory:

```bash
firebase init functions
```

**Choose these options:**
- ✅ Use an existing project (select your Firebase project)
- ✅ TypeScript
- ✅ ESLint: Yes (optional but recommended)
- ✅ Install dependencies: Yes

This will create a `functions` directory with the necessary structure.

## Step 3: Set Up Google Sheets API

### 3.1 Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (same project ID)
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Sheets API"
5. Click **Enable**

### 3.2 Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it: `firestore-to-sheets`
4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

### 3.3 Create and Download Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Download the JSON file
6. **IMPORTANT:** Save this file securely - you'll need it in Step 5

### 3.4 Create Google Sheet and Share It

1. Create a new Google Sheet (or use an existing one)
2. **Get the Sheet ID** from the URL:
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
   - Add the service account email (from the JSON file, field: `client_email`)
   - Give it **Editor** permissions
   - Click **Send**

## Step 4: Install Required Dependencies

```bash
cd functions
npm install googleapis
npm install --save-dev @types/node
cd ..
```

## Step 5: Configure Firebase Functions

You have two options for storing credentials:

### Option A: Using Firebase Functions Config (Recommended)

Extract values from your service account JSON:
- `client_email` → SERVICE_ACCOUNT_EMAIL
- `private_key` → SERVICE_ACCOUNT_KEY (keep the \n characters)

```bash
firebase functions:config:set \
  sheets.spreadsheet_id="YOUR_SHEET_ID_HERE" \
  sheets.service_account_email="your-service-account@project.iam.gserviceaccount.com" \
  sheets.service_account_key="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

**Note:** The private key must include `\n` characters. You can copy the entire key from the JSON file.

### Option B: Using Environment Variables (Alternative)

If you prefer using `.env` files, you can modify the function code to use `process.env` instead.

## Step 6: Deploy the Function

```bash
firebase deploy --only functions
```

## Step 7: Test the Integration

1. **Test automatic sync:**
   - Subscribe to the newsletter through your app
   - Check your Google Sheet - a new row should appear automatically

2. **Test manual sync (optional):**
   - Get the function URL from Firebase Console > Functions
   - Visit: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/syncAllSubscribers`
   - This will sync all existing subscribers

## Troubleshooting

### View Logs
```bash
firebase functions:log
```

Or in Firebase Console: **Functions** > **Logs**

### Common Issues

1. **Permission Denied**
   - Verify service account email has Editor access to the Sheet
   - Check the Sheet ID is correct

2. **Invalid Credentials**
   - Ensure private key includes `\n` characters
   - Verify service account JSON is valid

3. **Sheet Not Found**
   - Double-check the Sheet ID in the URL
   - Confirm the Sheet is shared with the service account

## Security Notes

- ⚠️ **Never commit service account keys to git**
- ✅ Use Firebase Functions config for secrets
- ✅ Only give Editor access to the specific Sheet (not the entire project)

## Next Steps

After setup is complete:
- Monitor logs for any errors
- Set up alerts if needed
- Consider creating separate sheets for dev/prod environments

