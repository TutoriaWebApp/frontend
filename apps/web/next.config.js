/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        backendBaseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1',
        internalBackendURL: process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1'
    },
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
