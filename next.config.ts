import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
experimental: {
  serverActions: {},
}
,
  output: 'standalone', // 🟡 Use standalone for Netlify SSR support
  reactStrictMode: true,
};

module.exports = nextConfig;
