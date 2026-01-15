import { differenceInHours, isBefore, addHours } from "date-fns";

/**
 * Vérifie si une annulation peut être effectuée (règle des 48h)
 */
export function canCancelLesson(lessonDate: Date, lessonStartTime: string): {
    canCancel: boolean;
    reason?: string;
    hoursUntilLesson?: number;
} {
    // Construire la date/heure complète du cours
    const [hours, minutes] = lessonStartTime.split(":").map(Number);
    const lessonDateTime = new Date(lessonDate);
    lessonDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const hoursUntilLesson = differenceInHours(lessonDateTime, now);

    // Vérifier si le cours est dans le passé
    if (isBefore(lessonDateTime, now)) {
        return {
            canCancel: false,
            reason: "Impossible d'annuler un cours passé",
            hoursUntilLesson,
        };
    }

    // Vérifier la règle des 48h
    if (hoursUntilLesson < 48) {
        return {
            canCancel: false,
            reason: "Annulation tardive (moins de 48h). L'heure sera décomptée sauf urgence justifiée.",
            hoursUntilLesson,
        };
    }

    return {
        canCancel: true,
        hoursUntilLesson,
    };
}

/**
 * Détermine si une annulation doit décompter une heure
 */
export function shouldDeductHour(
    lessonDate: Date,
    lessonStartTime: string,
    isUrgent: boolean,
    urgencyValidated: boolean
): boolean {
    const cancellationCheck = canCancelLesson(lessonDate, lessonStartTime);

    // Si annulation dans les délais, pas de décompte
    if (cancellationCheck.canCancel) {
        return false;
    }

    // Si urgence validée par admin, pas de décompte
    if (isUrgent && urgencyValidated) {
        return false;
    }

    // Sinon, décompter l'heure
    return true;
}

/**
 * Vérifie si un cours peut être confirmé (validation bilatérale)
 */
export function canConfirmLesson(
    studentConfirmed: boolean,
    instructorConfirmed: boolean
): {
    canConfirm: boolean;
    reason?: string;
} {
    if (studentConfirmed && instructorConfirmed) {
        return { canConfirm: true };
    }

    if (!studentConfirmed && !instructorConfirmed) {
        return {
            canConfirm: false,
            reason: "En attente de confirmation de l'élève et de l'instructeur",
        };
    }

    if (!studentConfirmed) {
        return {
            canConfirm: false,
            reason: "En attente de confirmation de l'élève",
        };
    }

    if (!instructorConfirmed) {
        return {
            canConfirm: false,
            reason: "En attente de confirmation de l'instructeur",
        };
    }

    return { canConfirm: false };
}

/**
 * Vérifie si un créneau est disponible pour réservation
 */
export function isSlotAvailable(
    slotDate: Date,
    slotStartTime: string,
    slotEndTime: string,
    existingLessons: Array<{
        date: Date;
        startTime: string;
        endTime: string;
        status: string;
    }>
): {
    available: boolean;
    reason?: string;
} {
    // Vérifier que le créneau est dans le futur
    const [hours, minutes] = slotStartTime.split(":").map(Number);
    const slotDateTime = new Date(slotDate);
    slotDateTime.setHours(hours, minutes, 0, 0);

    if (isBefore(slotDateTime, new Date())) {
        return {
            available: false,
            reason: "Ce créneau est dans le passé",
        };
    }

    // Vérifier les chevauchements avec les cours existants
    for (const lesson of existingLessons) {
        // Ignorer les cours annulés
        if (lesson.status === "CANCELLED") continue;

        // Vérifier si c'est le même jour
        if (lesson.date.toDateString() !== slotDate.toDateString()) continue;

        // Vérifier le chevauchement horaire
        const lessonStart = timeToMinutes(lesson.startTime);
        const lessonEnd = timeToMinutes(lesson.endTime);
        const slotStart = timeToMinutes(slotStartTime);
        const slotEnd = timeToMinutes(slotEndTime);

        // Chevauchement si : (slotStart < lessonEnd) ET (slotEnd > lessonStart)
        if (slotStart < lessonEnd && slotEnd > lessonStart) {
            return {
                available: false,
                reason: "Ce créneau chevauche un cours existant",
            };
        }
    }

    return { available: true };
}

/**
 * Convertit un temps HH:mm en minutes depuis minuit
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
