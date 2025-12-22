import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: "storage.googleapis.com", // Pour l'erreur actuelle
      },
      {
        protocol: "https",
        hostname: "cdn.auth0.com",
      },
      {
        protocol: "https",
        hostname: "ls-formation.fr",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase from default 1mb to 5mb
    },
  },
};

export default nextConfig;
