import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next guess the wrong
  // workspace root; pin it to this repo.
  turbopack: { root: __dirname },
};

export default nextConfig;
