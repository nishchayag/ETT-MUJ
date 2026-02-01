/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
