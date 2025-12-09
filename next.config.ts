import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Critical for Amplify SSR support
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
        hostname: 'www.casinobankingmethods.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
    ],
  },
  transpilePackages: ['@reduxjs/toolkit', 'react-redux'],
};

export default nextConfig;
