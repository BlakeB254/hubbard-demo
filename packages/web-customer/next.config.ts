import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hubbard-inn/shared'],
  // Note: Using SSR instead of static export to support dynamic routes
  // Cloudflare Pages supports Next.js SSR via @cloudflare/next-on-pages
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

export default nextConfig;
