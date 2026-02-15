import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("http://localhost:3000/**"),
      new URL("https://bakong.nbc.gov.kh/**"),
    ],
  },
};

export default nextConfig;
