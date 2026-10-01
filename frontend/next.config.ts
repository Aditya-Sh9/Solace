import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> on route navigations — app tab crossfade (AppShell)
    viewTransition: true,
  },
};

export default nextConfig;
