import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side API route to call Google Sheets webhook
 * This avoids CORS issues by calling from the server instead of the browser
 */
export async function POST(request: NextRequest) {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('Google Sheets webhook URL not configured');
      return NextResponse.json(
        { success: false, error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // Get the data from the request body
    const body = await request.json();

    // Call the Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Google Sheets webhook error:', result);
      return NextResponse.json(
        { success: false, error: result.error || 'Webhook failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error calling Google Sheets webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

