import type { NextConfig } from "next";
import WebpackObfuscator from "webpack-obfuscator";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
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
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            compact: true,
            stringArray: true,
            rotateStringArray: true,
            stringArrayThreshold: 0.75,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            sourceMap: false,
          },
          ["**/framework-*.js", "**/webpack-*.js"],
        ),
      );
    }

    return config;
  },
};

export default nextConfig;
