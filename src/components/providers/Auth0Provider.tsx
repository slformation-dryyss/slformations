'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function Auth0Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider
      profileUrl="/api/auth/me"
      loginUrl="/api/auth/login"
    >
      {children}
    </UserProvider>
  );
}
