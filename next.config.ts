// next.config.ts
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const withPWAWrap = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  buildExcludes: [/app-build-manifest\.json$/], // 避免 404 造成安裝失敗
  fallbacks: {
    document: '/offline.html',                 // ← 離線時的頁面
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withPWAWrap(nextConfig);
