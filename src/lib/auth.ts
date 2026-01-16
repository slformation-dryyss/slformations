import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// Rôles supportés dans l'application (alignés avec le champ `role` de Prisma)
// Hierarchy: OWNER > ADMIN > SECRETARY > [TEACHER, INSTRUCTOR] > STUDENT
export type Role = "OWNER" | "ADMIN" | "SECRETARY" | "TEACHER" | "INSTRUCTOR" | "STUDENT";

const AUTH0_ROLE_CLAIM = "https://sl-formations.fr/roles";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;

try {
  if (stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
} catch (error) {
  console.error("Stripe initialization failed (continuing without Stripe):", error);
}

// Helper pour décoder le JWT sans librairie externe (pour éviter erreurs NPM)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function mapAuth0RolesToPrisma(auth0Roles: string[] | undefined | null): { roles: Role[]; primaryRole: Role } {
  // Valeur par défaut : élève
  if (!auth0Roles || auth0Roles.length === 0) {
    return { roles: ["STUDENT"], primaryRole: "STUDENT" };
  }

  const roleSet = new Set<Role>(["STUDENT"]); // Tout le monde est au moins étudiant potentiellement
  const normalizedRoles = auth0Roles.map((r) => r.toLowerCase());

  if (normalizedRoles.includes("owner")) roleSet.add("OWNER");
  if (normalizedRoles.includes("admin")) roleSet.add("ADMIN");
  if (normalizedRoles.includes("secretary") || normalizedRoles.includes("secretaire")) roleSet.add("SECRETARY");

  // Distinction TEACHER vs INSTRUCTOR
  if (normalizedRoles.includes("teacher") || normalizedRoles.includes("enseignant")) roleSet.add("TEACHER");
  if (normalizedRoles.includes("instructor") || normalizedRoles.includes("moniteur")) roleSet.add("INSTRUCTOR");

  // Déterminer le rôle principal (le plus élevé)
  const roles = Array.from(roleSet);
  let primaryRole: Role = "STUDENT";

  if (roleSet.has("OWNER")) primaryRole = "OWNER";
  else if (roleSet.has("ADMIN")) primaryRole = "ADMIN";
  else if (roleSet.has("SECRETARY")) primaryRole = "SECRETARY";
  else if (roleSet.has("TEACHER")) primaryRole = "TEACHER"; // Priorité arbitraire entre Teacher et Instructor
  else if (roleSet.has("INSTRUCTOR")) primaryRole = "INSTRUCTOR";

  return { roles, primaryRole };
}

/**
 * Vérifie si `userRole` a les privilèges suffisants pour `requiredRole`
 * Hierarchy: OWNER > ADMIN > SECRETARY > [TEACHER, INSTRUCTOR] > STUDENT
 */
export function hasRole(userRoleOrUser: Role | string | any, requiredRole: Role): boolean {
  let userRoles: string[] = [];

  if (typeof userRoleOrUser === 'string') {
    userRoles = [userRoleOrUser];
  } else if (userRoleOrUser && Array.isArray(userRoleOrUser.roles)) {
    userRoles = userRoleOrUser.roles;
  } else if (userRoleOrUser && userRoleOrUser.role) {
    userRoles = [userRoleOrUser.role]; // Legacy fallback
  } else {
    return false;
  }

  const levels: Record<Role, number> = {
    OWNER: 50,
    ADMIN: 40,
    SECRETARY: 30,
    TEACHER: 20,
    INSTRUCTOR: 20,
    STUDENT: 10,
  };

  const requiredLevel = levels[requiredRole] || 0;

  // Check if ANY of the user's roles meets the level requirement
  return userRoles.some(role => {
    const level = levels[role as Role] || 0;
    return level >= requiredLevel;
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ... existing code ...

// Ajout de providedSession pour l'injection depuis afterCallback
export async function getOrCreateUser(req?: NextRequest, providedSession?: any) {
  let session;

  if (providedSession) {
    session = providedSession;
  } else if (req) {
    // Dans les Route Handlers (API), il faut passer req/res pour que getSession fonctionne avec Next 15+
    session = await auth0.getSession(req);
  } else {
    // Dans les Server Components, getSession() fonctionne implicitement
    session = await auth0.getSession();
  }

  if (!session?.user) {

    return null;
  }

  const { user: auth0User } = session;



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
  const sessionAny = session as any;
  const idToken = sessionAny.tokenSet?.idToken || sessionAny.idToken;

  if (!auth0Roles && idToken) {
    try {
      const decoded: any = parseJwt(idToken);
      if (decoded) {
        auth0Roles = decoded[AUTH0_ROLE_CLAIM];
      }
    } catch (e) {
      // ignore
    }
  }

  const { roles: mappedRoles, primaryRole: mappedPrimaryRole } = mapAuth0RolesToPrisma(auth0Roles);
  const mappedRoleLegacy = mappedPrimaryRole; // Pour le champ 'role' déprécié

  // On essaie d'abord de retrouver l'utilisateur via auth0Id,
  // puis on retombe sur l'email si besoin (pour les anciens comptes).
  let dbUser = null;
  try {
    dbUser =
      (auth0Id
        ? await prisma.user.findUnique({
          where: { auth0Id },
        })
        : null) ||
      (await prisma.user.findUnique({
        where: { email: auth0User.email },
      }));
  } catch (error) {
    console.error("[AUTH] Error trying to find user in DB:", error);
  }

  // Si trouvé, on synchronise le rôle + infos de base
  if (dbUser) {
    // Optimization: Check if an update is actually needed to reduce DB writes
    const timeSinceLastLogin = Date.now() - (dbUser.lastLoginAt?.getTime() || 0);
    const ONE_HOUR = 60 * 60 * 1000;

    const expectedRole = mappedRoleLegacy;

    // Check if roles need update (simple equality check on sorted arrays)
    const currentRolesAuth0 = JSON.stringify(mappedRoles.sort());
    const dbRoles = JSON.stringify((dbUser.roles || []).sort());

    const needsRolesUpdate = currentRolesAuth0 !== dbRoles;
    const needsRoleUpdate = dbUser.role !== expectedRole;
    const needsNameUpdate = (auth0User.name || auth0User.nickname) && dbUser.name !== (auth0User.name || auth0User.nickname);
    const needsEmailUpdate = (auth0User.email && dbUser.email !== auth0User.email);
    const needsAuth0IdUpdate = dbUser.auth0Id !== auth0Id;
    const needsLoginTimeUpdate = timeSinceLastLogin > ONE_HOUR;

    // Only hit the DB if something changed or it's been a while
    if (needsRoleUpdate || needsRolesUpdate || needsNameUpdate || needsEmailUpdate || needsAuth0IdUpdate || needsLoginTimeUpdate) {
      // On met à jour les métadonnées principales
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          role: expectedRole, // Legacy
          roles: mappedRoles, // New
          primaryRole: mappedPrimaryRole, // New

          name: auth0User.name || auth0User.nickname || dbUser.name,
          email: auth0User.email ?? dbUser.email,
          auth0Id: auth0Id, // On s'assure que l'ID Auth0 est bien lié
          firstName: dbUser.firstName ?? inferredFirstName ?? dbUser.firstName,
          lastName: dbUser.lastName ?? inferredLastName ?? dbUser.lastName,
          phone: dbUser.phone ?? inferredPhone ?? dbUser.phone,
          lastLoginAt: new Date(),
        },
      });
    }

    // Si on a Stripe configuré et pas encore de customer, on le crée maintenant
    if (stripe && !dbUser.stripeCustomerId) {
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
      } catch (err) { }
    }

    return dbUser;
  }

  // Si non trouvé, on le crée
  let created = await prisma.user.create({
    data: {
      auth0Id: auth0Id || auth0User.email, // fallback raisonnable si sub absent
      email: auth0User.email,
      name: auth0User.name || auth0User.nickname || "Utilisateur",
      firstName: inferredFirstName,
      lastName: inferredLastName,
      phone: inferredPhone,

      role: mappedRoleLegacy,
      roles: mappedRoles,
      primaryRole: mappedPrimaryRole,

      lastLoginAt: new Date(),
    },
  });

  // À la création, on génère aussi un customer Stripe si possible
  if (stripe) {
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
    } catch (err) { }
  }

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
    redirect("/api/auth/login");
  }

  const auth0User = session.user as any;
  const emailVerified = Boolean(auth0User.email_verified);

  if (!emailVerified) {
    redirect("/dashboard/verify-email");
  }

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
    redirect("/api/auth/login");
  }

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
    redirect("/dashboard/profile?onboarding=1");
  }

  return { user, auth0User };
}

/**
 * Helper : exige un utilisateur connecté (sans vérifier force du profil ou email), sinon redirige vers le login Auth0.
 */
export async function requireUser(req?: NextRequest) {
  const user = await getOrCreateUser(req);

  if (!user) {
    redirect("/api/auth/login");
  }

  return user;
}

/**
 * Helper générique : exige un rôle précis ou supérieur.
 */
export async function requireRole(requiredRole: Role, req?: NextRequest) {
  const user = await requireUser(req);

  // Utilisation de la nouvelle logique hasRole qui gère l'objet user
  if (!hasRole(user, requiredRole)) {
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

// Modifié : Vérifie explicitement le rôle INSTRUCTOR (conduite)
export async function requireInstructor(req?: NextRequest) {
  const user = await requireUser(req);

  // Specific check: user must be INSTRUCTOR or ADMIN/OWNER logic
  // hasRole handles hierarchy: INSTRUCTOR=20, ADMIN=40, OWNER=50
  if (!hasRole(user, "INSTRUCTOR")) {
    redirect("/dashboard");
  }
  return user;
}

// Modifié : Vérifie explicitement le rôle TEACHER (formation pro)
export async function requireTeacher(req?: NextRequest) {
  const user = await requireUser(req);

  // Hierarchy check: TEACHER=20. So ADMIN/OWNER also pass.
  if (!hasRole(user, "TEACHER")) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireStudent(req?: NextRequest) {
  return requireRole("STUDENT", req);
}

