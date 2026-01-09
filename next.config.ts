import type { NextConfig } from "next";

console.log("🏗️ [BUILD] Next config loaded. Environment:", process.env.NODE_ENV);

const nextConfig: NextConfig = {
  output: 'standalone', // Optimization for Clever Cloud / Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "cdn.auth0.com",
      },
      {
        protocol: "https",
        hostname: "ls-formation.fr",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  env: {
    // Force the Auth0 profile route to the public domain to prevent 0.0.0.0 errors
    NEXT_PUBLIC_PROFILE_ROUTE: 'https://sl-formations.fr/api/auth/me',
  },
};

export default nextConfig;
