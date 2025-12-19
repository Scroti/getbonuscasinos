/**
 * Google Apps Script Webhook for Newsletter Subscribers
 * 
 * This script receives subscriber data from your Next.js app and adds it to Google Sheets.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (the one with bonuses)
 * 2. Make sure you have a sheet/tab named "Newsletter" (or change the sheet name below)
 * 3. Go to Extensions > Apps Script
 * 4. Paste this entire code
 * 5. Click Deploy > New deployment
 * 6. Choose "Web app" as the type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone" (or "Anyone with Google account")
 * 9. Click Deploy and copy the Web App URL
 * 10. Add that URL to your Amplify environment variables as: NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
 */

/**
 * Webhook endpoint to receive subscriber data from your app
 * This function is called via HTTP POST from your Next.js app
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet (the one this script is attached to)
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get the "Newsletter" sheet/tab
    // If your sheet has a different name, change "Newsletter" to match your sheet name
    let sheet = spreadsheet.getSheetByName('Newsletter');
    
    // If the sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Newsletter');
      // Add headers if this is a new sheet
      sheet.appendRow([
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
      ]);
      // Make header row bold
      const headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
    }
    
    // Prepare row data matching the structure from your app
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
    
    // Log for debugging (view in Apps Script > Executions)
    Logger.log('Added subscriber: ' + data.email);
    
    // Return success response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Subscriber added to sheet successfully',
      email: data.email
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());
    
    // Return error response with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'Failed to add subscriber to sheet'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 * This is required for CORS to work properly
 */
function doOptions() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - Run this manually to test the webhook
 * Go to Apps Script > Run > testWebhook
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
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    documentId: 'test-doc-123'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
  
  // Check the result
  const resultData = JSON.parse(result.getContent());
  if (resultData.success) {
    Logger.log('✅ Test passed! Check your Newsletter sheet for the test entry.');
  } else {
    Logger.log('❌ Test failed: ' + resultData.error);
  }
}

/**
 * Optional: Function to set up headers if sheet is empty
 * Run this once to set up the header row
 */
function setupHeaders() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Newsletter');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Newsletter');
  }
  
  // Clear existing data (optional - comment out if you want to keep existing data)
  // sheet.clear();
  
  // Set headers
  const headers = [
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
  ];
  
  // Set header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  
  Logger.log('✅ Headers set up successfully!');
}

