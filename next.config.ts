import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            'recharts',
            'motion',
            'motion/react',
            '@apollo/client',
        ],
    },
};

export default nextConfig;
