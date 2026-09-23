import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow 127.0.0.1 for local HMR cross-origin requests
  allowedDevOrigins: ["127.0.0.1", "localhost:3000"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self)",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1drv.ms",
      },
      {
        protocol: "https",
        hostname: "onedrive.live.com",
      },
      {
        protocol: "https",
        hostname: "*.sharepoint.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "motion",
      "motion/react",
      "@apollo/client",
    ],
  },
};

export default nextConfig;
