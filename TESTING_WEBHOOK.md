# Testing the Newsletter Webhook Integration

## Method 1: Test Google Apps Script Directly (Quickest)

### Step 1: Test the Webhook Function in Apps Script

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. In the code editor, find the `testWebhook()` function
4. Click the dropdown next to the function name and select `testWebhook`
5. Click the **Run** button (▶️)
6. Authorize the script if prompted (click "Review permissions" and allow)
7. Check the **Execution log** at the bottom:
   - If successful, you'll see: `✅ Test passed! Check your Newsletter sheet for the test entry.`
   - If failed, you'll see the error message
8. Go back to your Google Sheet and check the **Newsletter** tab
   - You should see a test entry with email: `test@example.com`

### Step 2: Test with Real Data

You can also test by calling the webhook URL directly from your browser or using a tool like Postman/curl.

**Using Browser (GET request - may not work, but worth trying):**
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?email=test@example.com&subscribedAt=2024-01-01T00:00:00.000Z
```

**Using curl (POST request - proper way):**
```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "subscribedAt": "2024-01-01T00:00:00.000Z",
    "country": "United States",
    "countryCode": "US",
    "timezone": "America/New_York",
    "language": "en",
    "deviceType": "desktop",
    "screenResolution": "1920x1080",
    "referrer": "https://example.com",
    "userAgent": "Mozilla/5.0",
    "documentId": "test-123"
  }'
```

Replace `YOUR_SCRIPT_ID` with your actual script ID from the webhook URL.

## Method 2: Test Locally (Before Deployment)

### Step 1: Make sure environment variable is set

Check your `.env.local` file has:
```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Step 2: Start your local dev server

```bash
npm run dev
```

### Step 3: Test subscription

1. Open your app at `http://localhost:3000`
2. Subscribe to the newsletter using a test email
3. Check the browser console (F12) for any errors
4. Check your Google Sheet's **Newsletter** tab - a new row should appear

### Step 4: Check Apps Script logs

1. Go to Google Sheet > **Extensions** > **Apps Script**
2. Click **Executions** (clock icon on the left)
3. You should see recent executions with timestamps
4. Click on an execution to see details and logs

## Method 3: Test in Production (After Deployment)

### Step 1: Verify environment variable in Amplify

1. Go to AWS Amplify Console
2. **App settings** > **Environment variables**
3. Verify `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` is set correctly

### Step 2: Wait for deployment

Make sure your latest code is deployed to Amplify.

### Step 3: Test on live site

1. Go to your deployed website
2. Subscribe to the newsletter
3. Check Google Sheet's **Newsletter** tab
4. Check Apps Script **Executions** for logs

## Method 4: Debug if Not Working

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Subscribe to newsletter
4. Look for:
   - ✅ Success messages
   - ❌ Error messages (especially CORS or network errors)
   - ⚠️ Warnings about webhook failures

### Check Apps Script Logs

1. Google Sheet > **Extensions** > **Apps Script**
2. Click **Executions**
3. Look for recent executions
4. Click on failed executions to see error details

### Common Issues:

1. **CORS Error**
   - Make sure web app is deployed with "Anyone" access
   - Redeploy the web app in Apps Script

2. **404 or Script Not Found**
   - Verify the webhook URL is correct
   - Make sure the web app is deployed (not just saved)

3. **Permission Denied**
   - Make sure you authorized the script
   - Check that the script has permission to edit the sheet

4. **Data Not Appearing**
   - Check that the sheet name is exactly "Newsletter" (case-sensitive)
   - Verify headers are set up correctly
   - Check Apps Script logs for errors

## Quick Test Checklist

- [ ] Apps Script `testWebhook()` function runs successfully
- [ ] Test entry appears in Google Sheet
- [ ] Environment variable is set in `.env.local` (for local testing)
- [ ] Environment variable is set in Amplify (for production)
- [ ] Can subscribe through the app
- [ ] New row appears in Google Sheet after subscription
- [ ] No errors in browser console
- [ ] Apps Script executions show successful runs

## Expected Result

When everything works:
1. User subscribes to newsletter on your website
2. Subscriber is saved to Firestore ✅
3. Webhook is called automatically ✅
4. New row appears in Google Sheet "Newsletter" tab ✅
5. Row contains: Email, Subscribed At, Country, Timezone, Language, Device Type, etc. ✅

