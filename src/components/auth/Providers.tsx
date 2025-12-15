'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      profileUrl="/api/auth/me"
      loginUrl="/api/auth/login"
    >
      {children}
    </Auth0Provider>
  );
}
