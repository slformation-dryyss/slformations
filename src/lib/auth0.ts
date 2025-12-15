import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL,
  appBaseUrl: process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL,
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
    // @ts-ignore
    profile: '/api/auth/me',
  },
  session: {
    name: 'appSession',
    rolling: true,
    rollingDuration: 24 * 60 * 60, // 24 hours
    absoluteDuration: 7 * 24 * 60 * 60, // 7 days
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
});
