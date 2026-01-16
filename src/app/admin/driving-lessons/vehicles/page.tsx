import { requireAdmin } from "@/lib/auth";
import { getVehicles, getVehicleStats } from "./actions";
import { VehiclesClient } from "./VehiclesClient";
import { prisma } from "@/lib/prisma";

export default async function VehiclesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; transmission?: string; instructor?: string }>;
}) {
    await requireAdmin();

    const params = await searchParams;
    const filters = {
        status: params.status,
        transmission: params.transmission,
        instructorId: params.instructor,
    };

    const [vehiclesResult, statsResult, instructors] = await Promise.all([
        getVehicles(filters),
        getVehicleStats(),
        prisma.instructorProfile.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                user: {
                    firstName: "asc",
                },
            },
        }),
    ]);

    const vehicles = vehiclesResult.success ? vehiclesResult.data : [];
    const stats = statsResult.success ? statsResult.data : null;

    return (
        <VehiclesClient
            vehicles={vehicles as any}
            stats={stats ?? null}
            instructors={instructors as any}
            currentFilters={filters}
        />
    );
}
