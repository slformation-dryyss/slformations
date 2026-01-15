import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVerifiedUser } from "@/lib/auth";

// IMPORTANT :
// Pour éviter le bug cookies()/cookieStore avec Next 16 + Auth0 SDK côté serveur,
// cette route n'utilise PLUS `requireUser` ni `getSession`.
// On fait confiance à l'email envoyé depuis le client (useUser côté frontend).

// Force le mode dynamic pour cette route API
export const dynamic = "force-dynamic";

// Récupère le profil complet de l'utilisateur, identifié par son email
export async function GET(request: NextRequest) {
  // On tente de récupérer l'utilisateur via la session Auth0 sécurisée
  // Cela déclenche aussi la synchro (création DB, update rôles, Stripe, etc.)
  try {
    // Import dynamique pour éviter les cycles si nécessaire, ou usage direct
    const { getOrCreateUser } = await import("@/lib/auth");

    // On passe la request pour que getSession fonctionne en Route Handler (Next 15)
    const user = await getOrCreateUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Session invalide ou utilisateur introuvable" },
        { status: 401 }
      );
    }



    return NextResponse.json({
      id: user.id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      createdAt: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthDate: user.birthDate,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
      profession: user.profession,
      employerName: user.employerName,
      nationalIdNumber: user.nationalIdNumber,
      drivingLicenseNumber: user.drivingLicenseNumber,
      drivingLicenseType: user.drivingLicenseType,
      drivingLicenseIssuedAt: user.drivingLicenseIssuedAt,
      stripeCustomerId: user.stripeCustomerId,
      bio: user.bio,
      diplomas: user.diplomas,
      badges: user.badges,
    });

  } catch (error: any) {
    // Allow Next.js internal redirects to propagate
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    try {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("API Profile Error:", msg);
    } catch (e) {
      console.error("API Profile: Failed to log error");
    }

    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Erreur interne") },
      { status: 500 }
    );
  }
}

// Met à jour le profil détaillé de l'utilisateur, identifié par email dans le body
export async function PUT(request: Request) {
  const body = await request.json();

  if (!body.email) {
    return NextResponse.json(
      { error: "Champ 'email' manquant dans le body" },
      { status: 400 },
    );
  }

  // Les dates arrivent en string "YYYY-MM-DD" ou null depuis le formulaire
  const birthDate = body.birthDate ? new Date(body.birthDate) : null;
  const drivingLicenseIssuedAt = body.drivingLicenseIssuedAt
    ? new Date(body.drivingLicenseIssuedAt)
    : null;

  // On considère le profil "complet" si ces champs de base sont remplis
  const isProfileComplete =
    !!body.firstName &&
    !!body.lastName &&
    !!body.phone &&
    !!birthDate &&
    !!body.addressLine1 &&
    !!body.postalCode &&
    !!body.city &&
    !!body.country;

  const updated = await prisma.user.update({
    where: { email: body.email as string },
    data: {
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      phone: body.phone ?? null,
      birthDate,
      addressLine1: body.addressLine1 ?? null,
      addressLine2: body.addressLine2 ?? null,
      postalCode: body.postalCode ?? null,
      city: body.city ?? null,
      country: body.country ?? null,
      profession: body.profession ?? null,
      employerName: body.employerName ?? null,
      nationalIdNumber: body.nationalIdNumber ?? null,
      drivingLicenseNumber: body.drivingLicenseNumber ?? null,
      drivingLicenseType: body.drivingLicenseType ?? null,
      drivingLicenseIssuedAt,
      isProfileComplete,
      bio: body.bio ?? null,
      diplomas: body.diplomas ?? undefined, // Arrays need undefined or explicit set
    },
  });



  return NextResponse.json(updated);
}
// Crée ou Met à jour le profil (utilisé par l'Onboarding)
export async function POST(request: NextRequest) {
  try {
    // 1. Authentification sécurisée
    const { getOrCreateUser } = await import("@/lib/auth");
    const user = await getOrCreateUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 2. Préparation des données
    // On marque le profil comme complet si c'est explicitement demandé (Onboarding)
    const isProfileComplete = body.isOnboarding ? true : user.isProfileComplete;

    // 3. Update DB
    const updated = await prisma.user.update({
      where: { id: user.id }, // Sécurité : on update l'ID de la session
      data: {
        firstName: body.firstName ?? undefined,
        lastName: body.lastName ?? undefined,
        phone: body.phone ?? undefined,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        addressLine1: body.addressLine1 ?? undefined,
        postalCode: body.postalCode ?? undefined,
        city: body.city ?? undefined,
        country: body.country ?? undefined,
        profession: body.profession ?? undefined,
        isProfileComplete,
      },
    });

    // 4. Si c'est un instructeur, on s'assure qu'il a son InstructorProfile
    if (updated.role === "INSTRUCTOR") {
      await prisma.instructorProfile.upsert({
        where: { userId: updated.id },
        update: {
          city: body.city || "À définir",
          department: body.postalCode ? body.postalCode.substring(0, 2) : "À définir",
          postalCode: body.postalCode || null,
        },
        create: {
          userId: updated.id,
          city: body.city || "À définir",
          department: body.postalCode ? body.postalCode.substring(0, 2) : "À définir",
          postalCode: body.postalCode || null,
          specialty: "DRIVING",
        },
      });
    }

    return NextResponse.json(updated);

  } catch (error: any) {
    console.error("[ONBOARDING ERROR]", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

