import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      'eldenring', 'bloodborne', 'darksouls3', 'darksouls2', 'darksouls', 'demonssouls'
    ].map((wiki) => new URL(`https://${wiki}.wiki.fextralife.com/**`))
  }
};

export default nextConfig;
