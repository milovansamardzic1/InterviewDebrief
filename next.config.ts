import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@interwjuer/contracts"],
  allowedDevOrigins: ["192.168.0.10"],
};

export default nextConfig;
