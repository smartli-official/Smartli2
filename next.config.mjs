/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    // Strip console.* in production (keep error/warn) to shrink + speed up.
    removeConsole: { exclude: ['error', 'warn'] },
  },
  experimental: {
    // pdfjs-dist resolves its worker module at runtime; bundling it breaks
    // that resolution, so keep it as a real Node import in route handlers.
    serverComponentsExternalPackages: ['pdfjs-dist'],
    // Tree-shake the heaviest icon/animation/auth packages per-route so a
    // page only downloads the icons it actually renders.
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@clerk/nextjs',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-slot',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    // Long-lived immutable caching is a production optimization. In `next dev`
    // chunk URLs are stable across recompiles, so immutable headers make the
    // browser reuse stale JS after an edit — skip them in development.
    if (process.env.NODE_ENV !== 'production') return [];
    return [
      {
        // Immutable static assets: fonts, sounds, branding — cache for a year.
        source: '/:all*(svg|png|jpg|jpeg|gif|webp|avif|ico|mp3|wav|ogg|woff|woff2|ttf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
