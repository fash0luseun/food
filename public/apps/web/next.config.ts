import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@food-app/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Allow locally uploaded images served from /uploads/
    localPatterns: [
      { pathname: '/uploads/**' },
    ],
  },
}

export default config
