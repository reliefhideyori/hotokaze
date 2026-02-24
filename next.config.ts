import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ルート / → public/lp.html を静的サーブ
      { source: "/", destination: "/lp.html" },
    ];
  },
};

export default nextConfig;
