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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com *.auth0.com; connect-src 'self' *.stripe.com *.auth0.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' *.stripe.com *.auth0.com;",
          },
        ],
      },
    ];
  },
  env: {
    // Force the Auth0 profile route to the public domain to prevent 0.0.0.0 errors
    NEXT_PUBLIC_PROFILE_ROUTE: 'https://sl-formations.fr/api/auth/me',
  },
};

export default nextConfig;
