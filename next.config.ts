import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Only if you're using it
  },
  output: 'standalone', // 🟡 Use standalone for Netlify SSR support
  reactStrictMode: true,
};

module.exports = nextConfig;
