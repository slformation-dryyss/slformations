/**
 * Vérifier que les formations Permis B affichées sur /formations/permis-b
 * sont bien en base avec les bons slugs et prix.
 *
 * Exécution : npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/scripts/check-permis-b-courses.ts
 * Ou avec tsx : npx tsx prisma/scripts/check-permis-b-courses.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Slugs utilisés par la page (inclut les 2 variantes pour heures à l'unité : local vs prod)
const SLUGS_PAGE_PERMIS_B = [
  "permis-b-manuelle-classique",
  "permis-b-manuelle-serenite",
  "permis-b-auto-classique",
  "permis-b-auto-confort",
  "permis-b-aac-manuelle",
  "permis-b-aac-auto",
  "1h-conduite-manuelle",
  "1h-conduite-auto",
  "permis-b-h-manuelle",
  "permis-b-h-auto",
] as const;

async function main() {
  console.log("--- Vérification formations Permis B (page /formations/permis-b) ---\n");

  const courses = await prisma.course.findMany({
    where: { slug: { in: [...SLUGS_PAGE_PERMIS_B] } },
    select: { id: true, slug: true, title: true, price: true },
    orderBy: { slug: "asc" },
  });

  const foundSlugs = new Set(courses.map((c) => c.slug));

  console.log("| Slug (en BDD)                 | Titre (court)           | Prix   |");
  console.log("|-------------------------------|-------------------------|--------|");
  for (const c of courses) {
    const title = (c.title || "").slice(0, 24).padEnd(24);
    console.log(`| ${(c.slug || "").padEnd(30)} | ${title} | ${String(c.price).padStart(5)}€ |`);
  }

  // Forfaits : 1 slug requis chacun
  const slugsForfaits = [
    "permis-b-manuelle-classique",
    "permis-b-manuelle-serenite",
    "permis-b-auto-classique",
    "permis-b-auto-confort",
    "permis-b-aac-manuelle",
    "permis-b-aac-auto",
  ];
  // Heures à l'unité : 1 slug par paire suffit (local = 1h-conduite-*, prod = permis-b-h-*)
  const paireUniteManuelle = ["1h-conduite-manuelle", "permis-b-h-manuelle"];
  const paireUniteAuto = ["1h-conduite-auto", "permis-b-h-auto"];

  const missingForfaits = slugsForfaits.filter((s) => !foundSlugs.has(s));
  const hasUniteManuelle = paireUniteManuelle.some((s) => foundSlugs.has(s));
  const hasUniteAuto = paireUniteAuto.some((s) => foundSlugs.has(s));

  const missing: string[] = [
    ...missingForfaits,
    ...(hasUniteManuelle ? [] : ["Heure à l'unité Manuelle (1h-conduite-manuelle ou permis-b-h-manuelle)"]),
    ...(hasUniteAuto ? [] : ["Heure à l'unité Auto (1h-conduite-auto ou permis-b-h-auto)"]),
  ];

  if (missing.length > 0) {
    console.log("\n⚠️  Manquants en base (la page affichera « Sur devis ») :");
    missing.forEach((s) => console.log("   -", s));
    console.log("\n→ Créer ces formations (admin ou seed) ou exécuter : npm run db:seed");
  } else {
    console.log("\n✅ Toutes les formations attendues sont présentes en base (forfaits + au moins 1 slug par paire pour les heures à l'unité).");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
