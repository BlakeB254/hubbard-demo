import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Static export for Cloudflare Pages
  output: 'export',
  distDir: 'out',

  // Trailing slashes for static hosting
  trailingSlash: true,

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', 'recharts'],
  },
  transpilePackages: ['@hubbard-inn/shared'],

  // Image configuration - unoptimized for static export
  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.hubbardinn.com',
  },
};

export default nextConfig;
