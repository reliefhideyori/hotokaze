import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer はネイティブNode.js APIを使うため
  // webpackによるバンドル対象から除外し、Node.jsが直接importできるようにする
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
