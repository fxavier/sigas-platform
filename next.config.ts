/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  // Move skipTrailingSlashRedirect to root level
  skipTrailingSlashRedirect: true,
  experimental: {
    disableOptimizedLoading: true,
  },
  // Completely disable 404 page generation
  rewrites: async () => {
    return [
      {
        source: '/_not-found',
        destination: '/custom-404',
      },
    ];
  },
};

module.exports = nextConfig;
