/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    backendBaseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1',
    internalBackendURL: process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1',
    NEXT_PUBLIC_backendAchivementsBaseImageURL: 'http://localhost:8000/media/conquistas/',
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
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
