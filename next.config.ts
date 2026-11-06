import type { NextConfig } from "next";

// For GitHub Pages the site lives under /<repo>/, so the workflow sets
// NEXT_PUBLIC_BASE_PATH=/huif-website. Locally it's empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
