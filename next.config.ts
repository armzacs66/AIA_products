import type { NextConfig } from "next";

const basePath = process.env.GITHUB_PAGES === "true" ? "/AIA_training" : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  output: "export",
  basePath,
  trailingSlash: true,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
