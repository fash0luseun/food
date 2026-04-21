import type { NextConfig } from 'next'
import path from 'path'

const config: NextConfig = {
  transpilePackages: ['@food-app/shared'],
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  webpack(webpackConfig) {
    // Force all React imports to resolve to the local React 19 install
    // (prevents conflict with React 18 in the monorepo root node_modules)
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
    return webpackConfig
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
    ],
  },
}

export default config
