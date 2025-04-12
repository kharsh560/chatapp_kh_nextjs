import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 👈 This disables the double rendering in dev
  images: {
    domains: ["avatars.githubusercontent.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
