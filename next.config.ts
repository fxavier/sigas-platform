/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Completely disable static generation
  output: 'standalone',
  // Disable export of not-found
  experimental: {
    skipTrailingSlashRedirect: true,
    disableOptimizedLoading: true,
  },
};

module.exports = nextConfig;
