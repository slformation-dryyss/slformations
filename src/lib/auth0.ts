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
    rollingDuration: 60 * 60 * 24,
    absoluteDuration: 60 * 60 * 24 * 7,
  },
  async beforeSessionSaved(session, idToken) {
    if (idToken) {
      session.user = {
        ...session.user,
        "https://slformations.com/roles": idToken["https://slformations.com/roles"],
        "https://slformations.com/role": idToken["https://slformations.com/role"],
      };
    }
    return session;
  },
});
