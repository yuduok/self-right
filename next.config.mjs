/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience and to catch potential issues
  reactStrictMode: true,

  // Optimize package imports to reduce bundle size
  experimental: {
    // Only import used modules from these packages
    optimizePackageImports: ['antd', 'lucide-react'],

    // Enable script workers for better performance
    nextScriptWorkers: true,
  },

  // Image optimization configuration
  images: {
    // Set minimum cache TTL for optimized images (in seconds)
    minimumCacheTTL: 60,
    // Domains from which to allow external images
    domains: [],
  },

  // HTTP Agent options for better network performance
  httpAgentOptions: {
    keepAlive: true,
  },

  // Compress responses for better network performance
  compress: true,

  // Optimize production builds
  swcMinify: true,
};

export default nextConfig;
