import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Static export for Cloudflare Pages
  output: 'export',
  distDir: 'out',

  // Trailing slashes for static hosting
  trailingSlash: true,

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select', 'recharts'],
  },
  transpilePackages: ['@hubbard-inn/shared'],

  // Image configuration - unoptimized for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
