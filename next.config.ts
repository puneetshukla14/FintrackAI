import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {} // ✅ correct object
  },
  output: 'standalone', // ✅ for Netlify SSR support
  reactStrictMode: true
}

export default nextConfig
