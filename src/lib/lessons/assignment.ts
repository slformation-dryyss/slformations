import { prisma } from "@/lib/prisma";

/**
 * Algorithme d'attribution automatique d'instructeur à un élève
 * Priorité : Même ville > Même département > Départements voisins
 */
export async function assignInstructorToStudent(
    studentId: string,
    courseType: string,
    preferences?: {
        preferredGender?: "MALE" | "FEMALE" | "NO_PREFERENCE";
        preferredVehicleType?: "MANUAL" | "AUTOMATIC";
    }
) {
    // 1. Récupérer les informations de l'élève
    const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { city: true, postalCode: true },
    });

    if (!student) {
        throw new Error("Student not found");
    }

    // Extraire le département du code postal (2 premiers chiffres)
    const studentDepartment = student.postalCode?.substring(0, 2) || "";

    // 2. Rechercher les instructeurs disponibles avec scoring
    const instructors = await prisma.instructorProfile.findMany({
        where: {
            isActive: true,
            specialty: "DRIVING",
            licenseTypes: {
                has: courseType, // L'instructeur doit enseigner ce type de permis
            },
        },
        include: {
            user: {
                select: { id: true, firstName: true, lastName: true },
            },
            assignments: {
                where: { isActive: true },
                select: { id: true },
            },
        },
    });

    if (instructors.length === 0) {
        throw new Error("No available instructors found");
    }

    // 3. Calculer un score pour chaque instructeur
    const scoredInstructors = instructors.map((instructor) => {
        let score = 0;

        // Priorité géographique
        if (instructor.city === student.city) {
            score += 100; // Même ville = priorité maximale
        } else if (instructor.department === studentDepartment) {
            score += 50; // Même département
        } else {
            score += 10; // Autre département
        }

        // Charge de travail (moins d'élèves = meilleur score)
        const currentStudents = instructor.assignments.length;
        const maxStudents = instructor.maxStudentsPerWeek || 20;
        const workloadScore = Math.max(0, 30 - (currentStudents / maxStudents) * 30);
        score += workloadScore;

        // Préférences véhicule
        if (preferences?.preferredVehicleType) {
            if (
                instructor.vehicleType === preferences.preferredVehicleType ||
                instructor.vehicleType === "BOTH"
            ) {
                score += 10;
            }
        }

        return {
            instructor,
            score,
        };
    });

    // 4. Trier par score décroissant
    scoredInstructors.sort((a, b) => b.score - a.score);

    // 5. Sélectionner le meilleur instructeur
    const bestMatch = scoredInstructors[0];

    if (!bestMatch) {
        throw new Error("Could not find suitable instructor");
    }

    // 6. Créer l'attribution
    const assignment = await prisma.instructorAssignment.create({
        data: {
            studentId,
            instructorId: bestMatch.instructor.id,
            courseType,
            assignmentReason: "AUTO",
            isActive: true,
        },
        include: {
            instructor: {
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true },
                    },
                },
            },
        },
    });

    return assignment;
}

/**
 * Récupérer l'instructeur attitré d'un élève pour un type de cours
 */
export async function getStudentInstructor(studentId: string, courseType: string) {
    const assignment = await prisma.instructorAssignment.findFirst({
        where: {
            studentId,
            courseType,
            isActive: true,
        },
        include: {
            instructor: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return assignment;
}

/**
 * Changer l'instructeur d'un élève
 */
export async function changeInstructor(
    studentId: string,
    currentInstructorId: string,
    newInstructorId: string,
    courseType: string,
    reason: string
) {
    // 1. Désactiver l'ancienne attribution
    await prisma.instructorAssignment.updateMany({
        where: {
            studentId,
            instructorId: currentInstructorId,
            courseType,
            isActive: true,
        },
        data: {
            isActive: false,
            endDate: new Date(),
        },
    });

    // 2. Créer la nouvelle attribution
    const newAssignment = await prisma.instructorAssignment.create({
        data: {
            studentId,
            instructorId: newInstructorId,
            courseType,
            assignmentReason: reason,
            isActive: true,
        },
        include: {
            instructor: {
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true },
                    },
                },
            },
        },
    });

    return newAssignment;
}
