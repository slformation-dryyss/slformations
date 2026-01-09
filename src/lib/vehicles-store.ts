import { prisma } from "@/lib/prisma";

/**
 * Récupère tous les véhicules disponibles.
 */
export async function getVehicles() {
  return prisma.vehicle.findMany();
}

