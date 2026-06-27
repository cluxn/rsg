import type { NextConfig } from "next";
import path from "path";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const apiHost = new URL(apiUrl);

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      {
        protocol: apiHost.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiHost.hostname,
        port: apiHost.port || undefined,
      },
    ],
  },
};

export default nextConfig;
