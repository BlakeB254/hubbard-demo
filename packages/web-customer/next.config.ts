import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js 16 configuration
  reactStrictMode: true,

  // Static export for Cloudflare Pages
  output: 'export',
  distDir: 'out',

  // Trailing slashes for static hosting
  trailingSlash: true,

  // Enable experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
  },

  // Transpile shared package
  transpilePackages: ['@hubbard-inn/shared'],

  // Image configuration - unoptimized for static export
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.hubbardinn.com',
  },
};

export default nextConfig;
