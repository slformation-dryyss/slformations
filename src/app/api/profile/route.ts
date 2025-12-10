import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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

    console.log("[API /api/profile][GET] utilisateur courant synchro", {
      userId: user.id,
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
    });

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
      wantsVtcTraining: user.wantsVtcTraining,
      wantsTaxiTraining: user.wantsTaxiTraining,
      nationalIdNumber: user.nationalIdNumber,
      drivingLicenseNumber: user.drivingLicenseNumber,
      drivingLicenseType: user.drivingLicenseType,
      drivingLicenseIssuedAt: user.drivingLicenseIssuedAt,
      stripeCustomerId: user.stripeCustomerId, // Ajout utile pour le front
    });

  } catch (error: any) {
    console.error("[API /api/profile] Erreur getOrCreateUser", error);
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
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
      wantsVtcTraining:
        typeof body.wantsVtcTraining === "boolean"
          ? body.wantsVtcTraining
          : null,
      wantsTaxiTraining:
        typeof body.wantsTaxiTraining === "boolean"
          ? body.wantsTaxiTraining
          : null,
      nationalIdNumber: body.nationalIdNumber ?? null,
      drivingLicenseNumber: body.drivingLicenseNumber ?? null,
      drivingLicenseType: body.drivingLicenseType ?? null,
      drivingLicenseIssuedAt,
      isProfileComplete,
    },
  });

  console.log("[API /api/profile][PUT] profil mis à jour", {
    userId: updated.id,
    email: updated.email,
    isProfileComplete: updated.isProfileComplete,
  });

  return NextResponse.json(updated);
}

