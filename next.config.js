/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'media.cm', 'i.media.cm'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
