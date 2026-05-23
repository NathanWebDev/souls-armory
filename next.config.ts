import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://eldenring.wiki.fextralife.com/**')]
  }
};

export default nextConfig;
