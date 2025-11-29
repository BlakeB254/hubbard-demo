import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js 16 configuration
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    // Enable Partial Pre-Rendering (PPR) for instant navigation
    ppr: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
  },

  // Transpile shared package
  transpilePackages: ['@hubbard-inn/shared'],

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

export default nextConfig;
