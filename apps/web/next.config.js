/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        backendBaseURL: 'http://localhost:8000/v1'
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
