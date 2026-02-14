/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ["lucide-react"],
  },
  // External packages that should not be bundled
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
