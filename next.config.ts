import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL,
    NEXT_PUBLIC_G_TAG: process.env.NEXT_PUBLIC_G_TAG,
  },
};

export default nextConfig;
