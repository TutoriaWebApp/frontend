/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        backendBaseURL: 'http://localhost:8000/v1'
    }
};

export default nextConfig;
