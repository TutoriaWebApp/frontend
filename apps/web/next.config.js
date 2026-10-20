/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    backendBaseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1',
    internalBackendURL: process.env.INTERNAL_BACKEND_URL || process.env.BACKEND_BASE_URL || 'http://localhost:8000/v1',
    NEXT_PUBLIC_backendAchivementsBaseImageURL: process.env.BACKEND_ACHIEVEMENTS_IMAGES_URL,
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
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_BACKEND_HOSTNAME, 
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
