import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  headers: async () => {
    return [
      {
        source: "/photos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ],
      },
      {
        source: "/photos/_thumbs/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ],
      },
    ];
  },
};

export default nextConfig;
