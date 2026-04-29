/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['localhost:3000', 'sauzule.netlify.app'] } },
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
module.exports = nextConfig
