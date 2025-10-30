import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['placehold.co'], // 👈 allow external placeholder images
  },
};

export default nextConfig;
