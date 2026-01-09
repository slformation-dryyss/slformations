'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0/client';

export function Providers({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    console.log('[Providers] Mounting Auth0Provider. Origin:', window.location.origin);
  }
  return (
    <Auth0Provider>
      {children}
    </Auth0Provider>
  );
}

