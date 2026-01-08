import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // List of environment variables to check (showing actual values)
  const envVars = {
    ADMIN_CODE: process.env.ADMIN_CODE || "✗ Not set",
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || "✗ Not set",
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "✗ Not set",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "✗ Not set",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "✗ Not set",
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "✗ Not set",
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "✗ Not set",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "✗ Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "✗ Not set",
  };

  return NextResponse.json({
    message: "Environment variables status",
    environment: process.env.NODE_ENV,
    variables: envVars,
    timestamp: new Date().toISOString(),
  });
}

