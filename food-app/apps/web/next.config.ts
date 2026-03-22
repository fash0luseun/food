import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@food-app/shared'],
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
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
