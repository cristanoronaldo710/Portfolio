import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Don't advertise the framework version to scanners. */
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  images: {
    // Serve modern formats first; browsers that can't take them fall back.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    // Tree-shake the icon/motion barrel imports instead of pulling the whole
    // package into the client bundle.
    optimizePackageImports: ["framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Textures are content-stable and never revalidated by name, so they
        // can be cached hard.
        source: "/textures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
