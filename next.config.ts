import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This is the configuration for image quality we added earlier.
    qualities: [80],

    // This is the new part we are adding.
    // It tells Next.js to allow images from the Sanity CDN.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Required for Sanity Studio
  transpilePackages: ['next-sanity'],

  // Enable styled-components (used by Sanity Studio)
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
