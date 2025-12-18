# Google Sheets Delete Button Setup

This guide explains how to create a delete button in Google Sheets that deletes entries from both Firestore and the corresponding row in the sheet.

## Overview

The solution uses Google Apps Script with Firebase Admin SDK to:
1. Delete a document from Firestore `bonuses` collection by ID
2. Delete the corresponding row from Google Sheets

## Prerequisites

1. Google Sheet with bonus data (with Document ID column)
2. Firebase project with Firestore enabled
3. Service account with Firestore Admin permissions
4. Google Apps Script access

## Step 1: Set Up Firebase Admin SDK in Google Apps Script

### 1.1 Create a New Google Apps Script Project

1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Delete the default code

### 1.2 Add Firebase Admin SDK Library

1. In Apps Script editor, click **Libraries** (📚 icon) on the left
2. Click **+ Add a library**
3. Enter this Script ID: `1hguuh4Zx72XVC1Zldm_vThcUbyAW9cUwPqMfDuHV3hM`
4. Click **Add**
5. Select the latest version
6. Click **Save**

This is the Firebase Admin SDK for Apps Script.

### 1.3 Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the entire JSON content (you'll need it in the script)

## Step 2: Create the Delete Script

Replace the code in your Apps Script editor with the following:

```javascript
// Firebase Configuration
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Service Account Credentials (from the JSON file you downloaded)
const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "YOUR_SERVICE_ACCOUNT_EMAIL@YOUR_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

// Sheet Configuration
const SHEET_NAME = "Sheet1"; // Change to your sheet name
const ID_COLUMN = "L"; // Column with Document ID (adjust based on your sheet)

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
  const firebase = FirebaseApp.getDatabaseByUrl(
    `https://${FIREBASE_CONFIG.projectId}-default-rtdb.firebaseio.com/`,
    SERVICE_ACCOUNT
  );
  return firebase;
}

/**
 * Delete bonus from Firestore and Google Sheets by ID
 * @param {string} documentId - The Firestore document ID
 * @returns {object} Result object with success status and message
 */
function deleteBonusById(documentId) {
  try {
    if (!documentId || documentId.trim() === '') {
      return {
        success: false,
        message: 'Document ID is required'
      };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return {
        success: false,
        message: 'Sheet not found'
      };
    }

    // Find the row with this document ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    // Find the ID column index
    const idColumnIndex = headers.indexOf('Document ID');
    if (idColumnIndex === -1) {
      return {
        success: false,
        message: 'Document ID column not found'
      };
    }

    // Find the row number
    let rowToDelete = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][idColumnIndex] === documentId) {
        rowToDelete = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }

    if (rowToDelete === -1) {
      return {
        success: false,
        message: 'Document ID not found in sheet'
      };
    }

    // Delete from Firestore using Firebase Admin SDK
    const firebase = initializeFirebase();
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/bonuses/${documentId}`;
    
    try {
      // Use UrlFetchApp to call Firestore REST API
      const deleteResponse = UrlFetchApp.fetch(firestoreUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + getAccessToken(),
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.getResponseCode() !== 200 && deleteResponse.getResponseCode() !== 404) {
        // 404 means already deleted, which is fine
        const errorText = deleteResponse.getContentText();
        throw new Error(`Firestore delete failed: ${errorText}`);
      }
    } catch (firestoreError) {
      // If Firestore delete fails, still try to delete from sheet
      Logger.log('Firestore delete error: ' + firestoreError.toString());
    }

    // Delete the row from Google Sheets
    sheet.deleteRow(rowToDelete);

    return {
      success: true,
      message: `Successfully deleted bonus with ID: ${documentId}`
    };
  } catch (error) {
    Logger.log('Error in deleteBonusById: ' + error.toString());
    return {
      success: false,
      message: 'Error: ' + error.toString()
    };
  }
}

/**
 * Get OAuth2 access token for Firestore API
 */
function getAccessToken() {
  const service = getOAuthService();
  if (service.hasAccess()) {
    return service.getAccessToken();
  } else {
    throw new Error('OAuth service not authorized. Please run authorize() first.');
  }
}

/**
 * Set up OAuth2 service for Firestore
 */
function getOAuthService() {
  return OAuth2.createService('Firestore')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setClientId(SERVICE_ACCOUNT.client_id)
    .setClientSecret(SERVICE_ACCOUNT.private_key)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope('https://www.googleapis.com/auth/datastore')
    .setGrantType('service_account');
}

/**
 * Authorize the script (run this once)
 */
function authorize() {
  const service = getOAuthService();
  if (!service.hasAccess()) {
    const authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
    return authorizationUrl;
  }
  return 'Already authorized';
}

/**
 * Delete bonus from current row (to be called from button)
 */
function deleteCurrentRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRow = sheet.getActiveRange().getRow();
  
  if (activeRow === 1) {
    SpreadsheetApp.getUi().alert('Cannot delete header row');
    return;
  }

  // Get the document ID from the ID column
  const idColumnIndex = getColumnIndex(sheet, 'Document ID');
  if (idColumnIndex === -1) {
    SpreadsheetApp.getUi().alert('Document ID column not found');
    return;
  }

  const documentId = sheet.getRange(activeRow, idColumnIndex).getValue();
  
  if (!documentId) {
    SpreadsheetApp.getUi().alert('No Document ID found in this row');
    return;
  }

  // Confirm deletion
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Delete Bonus',
    `Are you sure you want to delete bonus with ID: ${documentId}?\n\nThis will delete it from both Firestore and this sheet.`,
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    const result = deleteBonusById(documentId);
    
    if (result.success) {
      ui.alert('Success', result.message, ui.ButtonSet.OK);
    } else {
      ui.alert('Error', result.message, ui.ButtonSet.OK);
    }
  }
}

/**
 * Helper function to get column index by header name
 */
function getColumnIndex(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(headerName) + 1; // +1 because arrays are 0-indexed but sheets are 1-indexed
}
```

## Step 3: Configure the Script

1. **Replace Firebase Configuration**:
   - Replace `YOUR_API_KEY`, `YOUR_PROJECT_ID`, etc. with your actual Firebase config values
   - You can find these in Firebase Console > Project Settings > General

2. **Replace Service Account**:
   - Replace the entire `SERVICE_ACCOUNT` object with the content from your downloaded JSON file
   - Make sure to keep the `\n` characters in the private key

3. **Update Sheet Configuration**:
   - Change `SHEET_NAME` to match your sheet name
   - Change `ID_COLUMN` to match the column letter where Document ID is stored

## Step 4: Authorize the Script

1. In Apps Script editor, run the `authorize()` function
2. Click **Run** > **authorize**
3. Review permissions and authorize
4. Copy the authorization URL if prompted and open it in a browser
5. Grant the necessary permissions

## Step 5: Add Delete Button to Google Sheets

### Option A: Using Drawing (Recommended)

1. In your Google Sheet, go to **Insert** > **Drawing**
2. Draw a button shape or use a text box
3. Write "Delete" on it
4. Click **Save and Close**
5. Right-click on the drawing and select **Assign script**
6. Enter: `deleteCurrentRow`
7. Click **OK**

### Option B: Using Checkbox with Script

1. Add a new column (e.g., column M) called "Delete"
2. Add checkboxes in this column for each row
3. Use this script instead:

```javascript
/**
 * Triggered when a checkbox is checked in the Delete column
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();
  
  // Check if the edit was in the Delete column
  const deleteColumnIndex = getColumnIndex(sheet, 'Delete');
  if (col === deleteColumnIndex && row > 1 && e.value === 'TRUE') {
    const idColumnIndex = getColumnIndex(sheet, 'Document ID');
    const documentId = sheet.getRange(row, idColumnIndex).getValue();
    
    if (documentId) {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        'Delete Bonus',
        `Delete bonus with ID: ${documentId}?`,
        ui.ButtonSet.YES_NO
      );
      
      if (response === ui.Button.YES) {
        const result = deleteBonusById(documentId);
        // Uncheck the checkbox
        sheet.getRange(row, col).setValue(false);
        
        if (result.success) {
          ui.alert('Success', result.message, ui.ButtonSet.OK);
        } else {
          ui.alert('Error', result.message, ui.ButtonSet.OK);
        }
      } else {
        // Uncheck if user said no
        sheet.getRange(row, col).setValue(false);
      }
    }
  }
}
```

## Step 6: Alternative - Using Cloud Function (More Secure)

For better security, you can create a Cloud Function that handles the deletion:

### 6.1 Create Cloud Function

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * HTTP Cloud Function to delete a bonus by ID
 * Call this from Google Apps Script
 */
export const deleteBonus = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { documentId, apiKey } = req.body;

  // Simple API key check (use environment variable in production)
  if (apiKey !== functions.config().sheets?.api_key) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!documentId) {
    res.status(400).json({ error: 'Document ID is required' });
    return;
  }

  try {
    // Delete from Firestore
    await admin.firestore().collection('bonuses').doc(documentId).delete();
    
    res.json({
      success: true,
      message: `Bonus ${documentId} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting bonus:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
```

### 6.2 Update Google Apps Script to Use Cloud Function

Replace the `deleteBonusById` function:

```javascript
const CLOUD_FUNCTION_URL = 'https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/deleteBonus';
const API_KEY = 'YOUR_SECRET_API_KEY'; // Set this in Firebase Functions config

function deleteBonusById(documentId) {
  try {
    const response = UrlFetchApp.fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        documentId: documentId,
        apiKey: API_KEY
      })
    });

    const result = JSON.parse(response.getContentText());
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.toString()
    };
  }
}
```

## Security Considerations

1. **API Key Protection**: Store API keys in Apps Script Properties:
   ```javascript
   PropertiesService.getScriptProperties().setProperty('API_KEY', 'your-key');
   const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
   ```

2. **Permissions**: Limit who can edit the sheet
3. **Validation**: Always validate document IDs before deletion
4. **Backup**: Consider keeping a backup of deleted entries

## Testing

1. Test with a sample document ID
2. Verify the document is deleted from Firestore
3. Verify the row is deleted from Google Sheets
4. Test error cases (invalid ID, missing ID, etc.)

## Troubleshooting

1. **"OAuth service not authorized"**: Run `authorize()` function first
2. **"Document ID not found"**: Check that the ID column name matches exactly
3. **"Firestore delete failed"**: Verify service account has Firestore Admin permissions
4. **"Sheet not found"**: Check the sheet name matches exactly

## Notes

- The script deletes from Firestore first, then from the sheet
- If Firestore deletion fails, the sheet row is still deleted (you may want to change this behavior)
- Always test with a non-critical entry first
- Consider adding a confirmation dialog before deletion

