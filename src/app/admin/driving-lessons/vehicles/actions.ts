"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// CRUD VÉHICULES
// ============================================

export async function createVehicle(formData: FormData) {
    await requireAdmin();

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const licensePlate = formData.get("licensePlate") as string;
    const year = parseInt(formData.get("year") as string);
    const transmission = formData.get("transmission") as string;
    const fuelType = formData.get("fuelType") as string;
    const assignedInstructorId = formData.get("assignedInstructorId") as string | null;

    if (!brand || !model || !licensePlate || !year || !transmission || !fuelType) {
        return { success: false, error: "Tous les champs obligatoires doivent être remplis" };
    }

    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                brand,
                model,
                licensePlate: licensePlate.toUpperCase(),
                year,
                transmission,
                fuelType,
                assignedInstructorId: assignedInstructorId || undefined,
            },
        });

        revalidatePath("/admin/driving-lessons/vehicles");
        return { success: true, data: vehicle };
    } catch (error: any) {
        console.error("Error creating vehicle:", error);
        return { success: false, error: error.message || "Erreur lors de la création du véhicule" };
    }
}

export async function updateVehicle(vehicleId: string, formData: FormData) {
    await requireAdmin();

    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const licensePlate = formData.get("licensePlate") as string;
    const year = parseInt(formData.get("year") as string);
    const transmission = formData.get("transmission") as string;
    const fuelType = formData.get("fuelType") as string;
    const status = formData.get("status") as string;
    const currentKm = formData.get("currentKm") ? parseInt(formData.get("currentKm") as string) : undefined;
    const assignedInstructorId = formData.get("assignedInstructorId") as string | null;

    try {
        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                brand,
                model,
                licensePlate: licensePlate.toUpperCase(),
                year,
                transmission,
                fuelType,
                status,
                currentKm,
                assignedInstructorId: assignedInstructorId || null,
            },
        });

        revalidatePath("/admin/driving-lessons/vehicles");
        revalidatePath(`/admin/driving-lessons/vehicles/${vehicleId}`);
        return { success: true, data: vehicle };
    } catch (error: any) {
        console.error("Error updating vehicle:", error);
        return { success: false, error: error.message || "Erreur lors de la mise à jour du véhicule" };
    }
}

export async function deleteVehicle(vehicleId: string) {
    await requireAdmin();

    try {
        // Vérifier si le véhicule a des cours associés
        const lessonsCount = await prisma.drivingLesson.count({
            where: { vehicleId },
        });

        if (lessonsCount > 0) {
            return {
                success: false,
                error: `Impossible de supprimer ce véhicule car il est associé à ${lessonsCount} cours`,
            };
        }

        await prisma.vehicle.delete({
            where: { id: vehicleId },
        });

        revalidatePath("/admin/driving-lessons/vehicles");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting vehicle:", error);
        return { success: false, error: error.message || "Erreur lors de la suppression du véhicule" };
    }
}

export async function getVehicles(filters?: {
    status?: string;
    transmission?: string;
    instructorId?: string;
}) {
    await requireAdmin();

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                ...(filters?.status && filters.status !== "ALL" ? { status: filters.status } : {}),
                ...(filters?.transmission && filters.transmission !== "ALL" ? { transmission: filters.transmission } : {}),
                ...(filters?.instructorId ? { assignedInstructorId: filters.instructorId } : {}),
            },
            include: {
                assignedInstructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                maintenanceRecords: {
                    orderBy: { performedAt: "desc" },
                    take: 1,
                },
                _count: {
                    select: {
                        lessons: true,
                        maintenanceRecords: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, data: vehicles };
    } catch (error: any) {
        console.error("Error fetching vehicles:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération des véhicules" };
    }
}

export async function getVehicleById(vehicleId: string) {
    await requireAdmin();

    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: {
                assignedInstructor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                maintenanceRecords: {
                    orderBy: { performedAt: "desc" },
                },
                lessons: {
                    where: {
                        status: { in: ["CONFIRMED", "COMPLETED"] },
                    },
                    orderBy: { date: "desc" },
                    take: 10,
                    include: {
                        student: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        instructor: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!vehicle) {
            return { success: false, error: "Véhicule introuvable" };
        }

        return { success: true, data: vehicle };
    } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération du véhicule" };
    }
}

// ============================================
// MAINTENANCE
// ============================================

export async function recordMaintenance(formData: FormData) {
    await requireAdmin();

    const vehicleId = formData.get("vehicleId") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : undefined;
    const performedBy = formData.get("performedBy") as string;
    const performedAt = new Date(formData.get("performedAt") as string);
    const nextDueDate = formData.get("nextDueDate") ? new Date(formData.get("nextDueDate") as string) : undefined;
    const kilometers = formData.get("kilometers") ? parseInt(formData.get("kilometers") as string) : undefined;
    const invoiceNumber = formData.get("invoiceNumber") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!vehicleId || !type || !description || !performedAt) {
        return { success: false, error: "Tous les champs obligatoires doivent être remplis" };
    }

    try {
        const maintenance = await prisma.vehicleMaintenance.create({
            data: {
                vehicleId,
                type,
                description,
                cost,
                performedBy,
                performedAt,
                nextDueDate,
                kilometers,
                invoiceNumber,
                notes,
            },
        });

        // Mettre à jour le véhicule
        await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                lastMaintenanceDate: performedAt,
                nextMaintenanceDate: nextDueDate,
                ...(kilometers ? { currentKm: kilometers } : {}),
            },
        });

        revalidatePath("/admin/driving-lessons/vehicles");
        revalidatePath(`/admin/driving-lessons/vehicles/${vehicleId}`);
        return { success: true, data: maintenance };
    } catch (error: any) {
        console.error("Error recording maintenance:", error);
        return { success: false, error: error.message || "Erreur lors de l'enregistrement de la maintenance" };
    }
}

export async function getMaintenanceHistory(vehicleId: string) {
    await requireAdmin();

    try {
        const records = await prisma.vehicleMaintenance.findMany({
            where: { vehicleId },
            orderBy: { performedAt: "desc" },
        });

        return { success: true, data: records };
    } catch (error: any) {
        console.error("Error fetching maintenance history:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération de l'historique" };
    }
}

// ============================================
// ATTRIBUTION
// ============================================

export async function assignVehicleToInstructor(vehicleId: string, instructorId: string | null) {
    await requireAdmin();

    try {
        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: {
                assignedInstructorId: instructorId,
            },
        });

        revalidatePath("/admin/driving-lessons/vehicles");
        revalidatePath(`/admin/driving-lessons/vehicles/${vehicleId}`);
        return { success: true, data: vehicle };
    } catch (error: any) {
        console.error("Error assigning vehicle:", error);
        return { success: false, error: error.message || "Erreur lors de l'attribution du véhicule" };
    }
}

// ============================================
// STATISTIQUES
// ============================================

export async function getVehicleStats() {
    await requireAdmin();

    try {
        const totalVehicles = await prisma.vehicle.count();
        const activeVehicles = await prisma.vehicle.count({
            where: { status: "ACTIVE", isAvailable: true },
        });
        const inMaintenance = await prisma.vehicle.count({
            where: { status: "MAINTENANCE" },
        });

        // Véhicules nécessitant une maintenance bientôt
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const maintenanceDueSoon = await prisma.vehicle.count({
            where: {
                nextMaintenanceDate: {
                    lte: in30Days,
                    gte: now,
                },
            },
        });

        // Véhicules en retard de maintenance
        const maintenanceOverdue = await prisma.vehicle.count({
            where: {
                nextMaintenanceDate: {
                    lt: now,
                },
            },
        });

        return {
            success: true,
            data: {
                totalVehicles,
                activeVehicles,
                inMaintenance,
                maintenanceDueSoon,
                maintenanceOverdue,
            },
        };
    } catch (error: any) {
        console.error("Error fetching vehicle stats:", error);
        return { success: false, error: error.message || "Erreur lors de la récupération des statistiques" };
    }
}
