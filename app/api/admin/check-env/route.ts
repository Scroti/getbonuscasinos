import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Check if admin is authenticated
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  const expectedToken = process.env.ADMIN_TOKEN || "admin_authenticated";
  
  if (!adminToken || adminToken.value !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // List of environment variables to check
  const envVars = {
    ADMIN_CODE: process.env.ADMIN_CODE ? "✓ Set" : "✗ Not set",
    ADMIN_TOKEN: process.env.ADMIN_TOKEN ? "✓ Set" : "✗ Not set",
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? "✓ Set" : "✗ Not set",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ? "✓ Set" : "✗ Not set",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Not set",
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ? "✓ Set" : "✗ Not set",
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ? "✓ Set" : "✗ Not set",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? "✓ Set" : "✗ Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? "✓ Set" : "✗ Not set",
  };

  return NextResponse.json({
    message: "Environment variables status",
    environment: process.env.NODE_ENV,
    variables: envVars,
    timestamp: new Date().toISOString(),
  });
}

