import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_ISSUER_BASE_URL!,
  appBaseUrl: process.env.AUTH0_BASE_URL!,
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback',
    // @ts-ignore
    profile: '/api/auth/me',
  },
  session: {
    inactivityDuration: 60 * 60 * 24,
    absoluteDuration: 60 * 60 * 24 * 7,
  },
  async beforeSessionSaved(session, idToken) {
    if (idToken) {
      // Parse token if it's a string (JWT)
      let token: any = idToken;
      if (typeof idToken === 'string') {
        try {
          const base64Url = idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          // Use atob instead of Buffer for Edge Runtime compatibility
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          token = JSON.parse(jsonPayload);
        } catch (e) {
          console.error("❌ [AUTH0] Failed to parse token:", e);
          return session;
        }
      }

      const namespace = "https://sl-formations.fr/roles";
      const roles = (token[namespace] || []) as string[];

      let computedRole = "STUDENT";
      // 1. Try to get role from Token
      const rolesList = Array.isArray(roles) ? roles : [roles];
      const lowerRoles = rolesList.map(r => String(r).toLowerCase());

      if (lowerRoles.includes("owner")) computedRole = "OWNER";
      else if (lowerRoles.includes("admin")) computedRole = "ADMIN";
      else if (lowerRoles.includes("secretary") || lowerRoles.includes("secretaire")) computedRole = "SECRETARY";
      else if (lowerRoles.includes("instructor") || lowerRoles.includes("teacher")) computedRole = "INSTRUCTOR";

      session.user = {
        ...session.user,
        role: computedRole,
        [namespace]: roles,
      };
    }
    return session;
  },
});

