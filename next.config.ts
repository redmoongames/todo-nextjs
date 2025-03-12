import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ui-avatars.com'],
  },
  // Explicitly expose environment variables to the browser
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Add rewrites for API requests to handle CORS issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
