/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
      ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
    ],
  },
};

export default nextConfig;
