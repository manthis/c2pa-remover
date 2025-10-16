import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow blob URLs and data URLs by using unoptimized mode
    unoptimized: true,
  },
};

export default nextConfig;
