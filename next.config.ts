import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker
  output: 'standalone',

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graph.digiseller.ru',
      },
      {
        protocol: 'https',
        hostname: '*.digiseller.ru',
      },
    ],
  },
};

export default nextConfig;
