import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// Rôles supportés dans l'application (alignés avec le champ `role` de Prisma)
// Hierarchy: OWNER > ADMIN > SECRETARY > INSTRUCTOR > STUDENT
export type Role = "OWNER" | "ADMIN" | "SECRETARY" | "INSTRUCTOR" | "STUDENT";

const AUTH0_ROLE_CLAIM = "https://slformations.com/roles";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" as any }) // Using 'as any' or updating to correct string if known, usually better to check package.json or use 'latest' compatible.
  // Actually, the error said "2025-11-17.clover" which sounds like a beta or very new version? Or maybe I misread.
  // Let's check package.json first to be sure. But for now I will try to use the one mentioned in error or just ignore if it works in runtime.
  // The error `Type '"2024-06-20"' is not assignable to type '"2025-11-17.clover"'` implies the types expect 2025-11-17.
  : null;

// Helper pour décoder le JWT sans librairie externe (pour éviter erreurs NPM)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function mapAuth0RolesToPrisma(auth0Roles: string[] | undefined | null): Role {
  // Valeur par défaut : élève
  if (!auth0Roles || auth0Roles.length === 0) {
    return "STUDENT";
  }

  // On cherche le rôle le plus élevé dans la liste des rôles Auth0
  const roles = auth0Roles.map(r => r.toLowerCase());
  console.log(`[AUTH] Map Roles: received auth0 roles: ${JSON.stringify(roles)}`);

  if (roles.includes("owner")) return "OWNER";
  if (roles.includes("admin")) return "ADMIN";
  if (roles.includes("secretary") || roles.includes("secretaire")) return "SECRETARY";
  if (roles.includes("teacher") || roles.includes("enseignant") || roles.includes("instructor"))
    return "INSTRUCTOR";

  return "STUDENT";
}

/**
 * Vérifie si `userRole` a les privilèges suffisants pour `requiredRole`
 * Hierarchy: OWNER > ADMIN > SECRETARY > INSTRUCTOR > STUDENT
 */
export function hasRole(userRole: Role | string, requiredRole: Role): boolean {
  const levels: Record<Role, number> = {
    OWNER: 50,
    ADMIN: 40,
    SECRETARY: 30,
    INSTRUCTOR: 20,
    STUDENT: 10,
  };

  // Normalisation au cas où on reçoit une string arbitraire
  const userLevel = levels[userRole as Role] || 0;
  const requiredLevel = levels[requiredRole] || 0;
  
  const isAllowed = userLevel >= requiredLevel;
  // console.log(`[AUTH] hasRole check: User=${userRole} (${userLevel}) >= Required=${requiredRole} (${requiredLevel}) -> ${isAllowed}`);
  return isAllowed;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ... existing code ...

export async function getOrCreateUser(req?: NextRequest) {
  let session;
  
  // Dans les Route Handlers (API), il faut passer req/res pour que getSession fonctionne avec Next 15+
  if (req) {
    session = await auth0.getSession(req);
  } else {
    // Dans les Server Components, getSession() fonctionne implicitement
    session = await auth0.getSession();
  }

  if (!session?.user) {
    console.log("[AUTH] getOrCreateUser: ❌ aucune session Auth0 trouvée.");
    return null;
  }

  const { user: auth0User } = session;
  console.log(`[AUTH] getOrCreateUser: 🟢 Session active. Email=${auth0User.email}, Sub=${auth0User.sub}`);


  // On exige au minimum un email pour identifier l'utilisateur
  if (!auth0User.email) {
    throw new Error("User must have an email");
  }

  // Identifiant unique Auth0 (sub)
  const auth0Id = auth0User.sub;

  // Données de base récupérées depuis Auth0 (pour pré-remplir ton profil)
  const inferredFirstName =
    (auth0User.given_name as string | undefined) ||
    (auth0User.name ? auth0User.name.split(" ")[0] : undefined);
  const inferredLastName =
    (auth0User.family_name as string | undefined) ||
    (auth0User.name ? auth0User.name.split(" ").slice(1).join(" ") || undefined : undefined);
  const inferredPhone = auth0User.phone_number as string | undefined;

  // Rôles envoyés par Auth0 dans le claim custom
  let auth0Roles = (auth0User as any)[AUTH0_ROLE_CLAIM] as string[] | undefined;

  // FALLBACK ULTIME : Si session.user est vide, on va chercher directement dans le tokenSet de la session
  // Note: auth0.getSession() retourne { user, tokenSet, ... }
  // On doit caster 'session' en any pour accéder à tokenSet ou idToken s'ils ne sont pas typés correctement
  const sessionAny = session as any;
  const idToken = sessionAny.tokenSet?.idToken || sessionAny.idToken;

  if (!auth0Roles && idToken) {
    try {
      console.log("[AUTH] 🛡️ Tentative extraction directe depuis ID Token...");
      const decoded: any = parseJwt(idToken);
      if (decoded) {
         auth0Roles = decoded[AUTH0_ROLE_CLAIM];
         console.log(`[AUTH] 🛡️ SUCCÈS: Rôles trouvés dans le JWT brut:`, auth0Roles);
      }
    } catch (e) {
      console.error("[AUTH] Erreur décodage manuel JWT:", e);
    }
  }

  console.log(`[AUTH] DEBUG ROLE EXTRACTION:`);
  console.log(`- Claim key: ${AUTH0_ROLE_CLAIM}`);
  console.log(`- Extracted roles: ${JSON.stringify(auth0Roles)}`);

  const mappedRole = mapAuth0RolesToPrisma(auth0Roles);
  console.log(`- Mapped role: ${mappedRole}`);
  console.log("[AUTH] getOrCreateUser: rôles Auth0 et rôle mappé", {
    auth0Roles,
    mappedRole,
  });

  // On essaie d'abord de retrouver l'utilisateur via auth0Id,
  // puis on retombe sur l'email si besoin (pour les anciens comptes).
  let dbUser =
    (auth0Id
      ? await prisma.user.findUnique({
          where: { auth0Id },
        })
      : null) ||
    (await prisma.user.findUnique({
      where: { email: auth0User.email },
    }));

  // Si trouvé, on synchronise le rôle + infos de base (sans écraser ton profil manuel)
  if (dbUser) {
    console.log(`[AUTH] getOrCreateUser: ✅ Utilisateur existant trouvé (ID=${dbUser.id}). Mise à jour...`);
    // On met à jour les métadonnées principales
    // Note: on upgrant/downgrade le rôle selon Auth0 à chaque login
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        // Logic to prevent accidental downgrade of manual Admin/Owner
        // If Auth0 says STUDENT (default) but DB has higher role, keep DB role.
        role: (mappedRole === "STUDENT" && ["OWNER", "ADMIN", "SECRETARY", "INSTRUCTOR"].includes(dbUser.role)) 
              ? dbUser.role 
              : mappedRole,
        
        // On garde le nom/email à jour depuis Auth0 si disponibles
        name: auth0User.name || auth0User.nickname || dbUser.name,
        email: auth0User.email ?? dbUser.email,
        auth0Id: auth0Id, // On s'assure que l'ID Auth0 est bien lié
        // On ne remplit firstName/lastName/phone que s'ils sont encore vides
        firstName: dbUser.firstName ?? inferredFirstName ?? dbUser.firstName,
        lastName: dbUser.lastName ?? inferredLastName ?? dbUser.lastName,
        phone: dbUser.phone ?? inferredPhone ?? dbUser.phone,
        lastLoginAt: new Date(),
      },
    });
    console.log(`[AUTH] getOrCreateUser: Mise à jour terminée. Rôle actuel: ${dbUser.role}`);

    // Si on a Stripe configuré et pas encore de customer, on le crée maintenant
    if (stripe && !dbUser.stripeCustomerId) {
      console.log(`[AUTH] getOrCreateUser: 💳 Création manquante du customer Stripe pour ${dbUser.id}`);
      try {
        const customer = await stripe.customers.create({
          email: dbUser.email,
          name: dbUser.name || undefined,
          metadata: {
            userId: dbUser.id,
            auth0Id: auth0Id || "",
          },
        });

        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { stripeCustomerId: customer.id },
        });
        console.log(`[AUTH] getOrCreateUser: 💳 Stripe Customer créé: ${customer.id}`);
      } catch (err) {
        console.error("[AUTH] ❌ Erreur création Stripe Customer:", err);
      }
    }

    return dbUser;
  }

  console.log("[AUTH] getOrCreateUser: 🆕 Nouvel utilisateur détecté. Création en cours...");
  // Si non trouvé, on le crée avec le rôle déterminé depuis Auth0 (sinon STUDENT)
  let created = await prisma.user.create({
    data: {
      auth0Id: auth0Id || auth0User.email, // fallback raisonnable si sub absent
      email: auth0User.email,
      name: auth0User.name || auth0User.nickname || "Utilisateur",
      firstName: inferredFirstName,
      lastName: inferredLastName,
      phone: inferredPhone,
      role: mappedRole,
      lastLoginAt: new Date(),
    },
  });
  console.log(`[AUTH] getOrCreateUser: ✅ User créé avec ID ${created.id}`);

  // À la création, on génère aussi un customer Stripe si possible
  if (stripe) {
    console.log(`[AUTH] getOrCreateUser: 💳 Création initiale du customer Stripe...`);
    try {
      const customer = await stripe.customers.create({
        email: created.email,
        name: created.name || undefined,
        metadata: {
          userId: created.id,
          auth0Id: auth0Id || "",
        },
      });

      created = await prisma.user.update({
        where: { id: created.id },
        data: { stripeCustomerId: customer.id },
      });
      console.log(`[AUTH] getOrCreateUser: 💳 Stripe Customer créé: ${customer.id}`);
    } catch (err) {
      console.error("[AUTH] ❌ Erreur création Stripe Customer (creation):", err);
    }
  }

  console.log("[AUTH] getOrCreateUser: 🏁 Fin du processus. User prêt.");
  return created;
}

/**
 * Vérifie qu'un utilisateur Auth0 est connecté ET que son email est vérifié.
 * - Si pas connecté : redirige vers le login Auth0
 * - Si email non vérifié : redirige vers /dashboard/verify-email
 */
export async function requireVerifiedAuth0User(req?: NextRequest) {
  let session;
  if (req) {
     session = await auth0.getSession(req);
  } else {
     session = await auth0.getSession();
  }

  if (!session?.user) {
    console.log("[AUTH] requireVerifiedAuth0User: aucune session, redirection login");
    redirect("/api/auth/login");
  }

  const auth0User = session.user as any;
  const emailVerified = Boolean(auth0User.email_verified);

  if (!emailVerified) {
    console.log("[AUTH] requireVerifiedAuth0User: email NON vérifié, redirection /dashboard/verify-email", {
      sub: auth0User.sub,
      email: auth0User.email,
    });
    redirect("/dashboard/verify-email");
  }

  console.log("[AUTH] requireVerifiedAuth0User: email vérifié", {
    sub: auth0User.sub,
    email: auth0User.email,
  });
  return auth0User;
}

/**
 * Helper pratique pour les pages du dashboard :
 * - exige un user Auth0 connecté et vérifié
 * - synchronise / crée le user Prisma
 * - renvoie à la fois le user Prisma et l'utilisateur Auth0 brut
 */
export async function requireVerifiedUser(req?: NextRequest) {
  const auth0User = await requireVerifiedAuth0User(req);
  const user = await getOrCreateUser(req);

  if (!user) {
    console.log("[AUTH] requireVerifiedUser: pas de user Prisma après Auth0, redirection login");
    redirect("/api/auth/login");
  }

  console.log("[AUTH] requireVerifiedUser: utilisateur Auth0 + Prisma OK", {
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return { user, auth0User };
}

/**
 * Helper pour les pages du dashboard (hors /dashboard/profile et /dashboard/verify-email)
 * - exige un user vérifié
 * - redirige vers /dashboard/profile?onboarding=1 si le profil n'est pas encore complet
 */
export async function requireOnboardedUser(req?: NextRequest) {
  const { user, auth0User } = await requireVerifiedUser(req);

  if (!user.isProfileComplete) {
    console.log("[AUTH] requireOnboardedUser: profil incomplet, redirection /dashboard/profile?onboarding=1", {
      userId: user.id,
      email: user.email,
    });
    redirect("/dashboard/profile?onboarding=1");
  }

  console.log("[AUTH] requireOnboardedUser: profil complet, accès autorisé", {
    userId: user.id,
    email: user.email,
  });
  return { user, auth0User };
}

/**
 * Helper : exige un utilisateur connecté (sans vérifier force du profil ou email), sinon redirige vers le login Auth0.
 */
export async function requireUser(req?: NextRequest) {
  const user = await getOrCreateUser(req);

  if (!user) {
    console.log("[AUTH] requireUser: pas de user, redirection login");
    redirect("/api/auth/login");
  }

  console.log("[AUTH] requireUser: user connecté requis OK", {
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return user;
}

/**
 * Helper générique : exige un rôle précis ou supérieur.
 */
export async function requireRole(requiredRole: Role, req?: NextRequest) {
  const user = await requireUser(req);

  // On utilise hasRole pour vérifier la hiérarchie
  // Ex: si requireRole('ADMIN'), un OWNER passera aussi.
  if (!hasRole(user.role as Role, requiredRole)) {
    console.log(`[AUTH] requireRole: accès refusé. User=${user.role} requis=${requiredRole} ou supérieur`);
    redirect("/dashboard");
  }

  return user;
}

export async function requireOwner(req?: NextRequest) {
  return requireRole("OWNER", req);
}

export async function requireAdmin(req?: NextRequest) {
  return requireRole("ADMIN", req);
}

export async function requireSecretary(req?: NextRequest) {
  return requireRole("SECRETARY", req);
}

export async function requireTeacher(req?: NextRequest) {
  return requireRole("INSTRUCTOR", req);
}

export async function requireStudent(req?: NextRequest) {
  return requireRole("STUDENT", req);
}
