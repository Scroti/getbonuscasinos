import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // List of mapped environment variables to check (showing actual values)
  const mappedEnvVars = {
    ADMIN_CODE: process.env.ADMIN_CODE || "✗ Not set",
    ADMIN_TOKEN: process.env.ADMIN_TOKEN || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "✗ Not set",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "✗ Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "✗ Not set",
  };

  // Get ALL environment variables
  const allEnvVars: Record<string, string> = {};
  for (const key in process.env) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      allEnvVars[key] = process.env[key] || "";
    }
  }

  // AWS Amplify platform variables (automatically set by Amplify)
  const awsPlatformPrefixes = [
    'AWS_', '_HANDLER', 'LAMBDA_', 'NODE_', 'PATH', 'PWD', 'SHLVL', 
    'HOME', 'USER', 'SHELL', 'TZ', 'LC_', 'LANG', 'LD_', 'PYTHON',
    'AMPLIFY_', 'VERCEL_', 'NEXT_', 'NPM_', 'YARN_', 'CI_', 'GIT_'
  ];

  // Categorize environment variables
  const mappedKeys = Object.keys(mappedEnvVars);
  const userDefinedVars: Record<string, string> = {};
  const awsPlatformVars: Record<string, string> = {};
  const otherUnmappedVars: Record<string, string> = {};

  for (const key in allEnvVars) {
    if (mappedKeys.includes(key)) {
      continue; // Skip mapped variables
    }

    // Check if it's an AWS/Amplify platform variable
    const isPlatformVar = awsPlatformPrefixes.some(prefix => key.startsWith(prefix));
    
    if (isPlatformVar) {
      awsPlatformVars[key] = allEnvVars[key];
    } else {
      // User-defined but unmapped
      userDefinedVars[key] = allEnvVars[key];
    }
  }

  return NextResponse.json({
    message: "Environment variables status",
    environment: process.env.NODE_ENV,
    mapped: mappedEnvVars,
    userDefined: userDefinedVars,
    awsPlatform: awsPlatformVars,
    all: allEnvVars,
    timestamp: new Date().toISOString(),
  });
}

