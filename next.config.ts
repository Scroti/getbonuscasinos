import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Amplify SSR
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.correctcasinos.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.irishluck.ie',
      },
      {
        protocol: 'https',
        hostname: 'www.playcasino.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.casinobankingmethods.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
    ],
  },
  transpilePackages: ['@reduxjs/toolkit', 'react-redux'],
  // Explicitly include server-side environment variables for standalone build
  env: {
    ADMIN_CODE: process.env.ADMIN_CODE,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
  },
};

export default nextConfig;
