import { addDays, addWeeks, addMonths, isBefore, isAfter, startOfDay } from "date-fns";

export type RecurrencePattern = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RecurringSlot {
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    recurrencePattern: RecurrencePattern;
    recurrenceDays?: number[]; // Pour WEEKLY: [1,3,5] = Lundi, Mercredi, Vendredi
    recurrenceEndDate: Date;
}

/**
 * Génère une liste de dates pour un créneau récurrent
 */
export function generateRecurringDates(
    startDate: Date,
    pattern: RecurrencePattern,
    endDate: Date,
    daysOfWeek?: number[] // 1=Lundi, 7=Dimanche
): Date[] {
    const dates: Date[] = [];
    let currentDate = startOfDay(startDate);
    const end = startOfDay(endDate);

    // Limite de sécurité : max 365 occurrences
    const maxOccurrences = 365;
    let count = 0;

    while (
        (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) &&
        count < maxOccurrences
    ) {
        // Pour WEEKLY, vérifier si le jour correspond
        if (pattern === "WEEKLY") {
            const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Dimanche = 7
            if (daysOfWeek && daysOfWeek.includes(dayOfWeek)) {
                dates.push(new Date(currentDate));
            }
            currentDate = addDays(currentDate, 1);
        } else if (pattern === "DAILY") {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        } else if (pattern === "MONTHLY") {
            dates.push(new Date(currentDate));
            currentDate = addMonths(currentDate, 1);
        }

        count++;
    }

    return dates;
}

/**
 * Valide qu'un créneau récurrent est cohérent
 */
export function validateRecurringSlot(slot: RecurringSlot): {
    valid: boolean;
    error?: string;
} {
    // Vérifier le format des heures
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return { valid: false, error: "Format d'heure invalide (attendu HH:mm)" };
    }

    // Vérifier que startTime < endTime
    const [startHour, startMin] = slot.startTime.split(":").map(Number);
    const [endHour, endMin] = slot.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
        return { valid: false, error: "L'heure de fin doit être après l'heure de début" };
    }

    // Vérifier la durée minimale (1h)
    if (endMinutes - startMinutes < 60) {
        return { valid: false, error: "La durée minimale d'un créneau est de 1 heure" };
    }

    // Pour WEEKLY, vérifier que des jours sont spécifiés
    if (slot.recurrencePattern === "WEEKLY") {
        if (!slot.recurrenceDays || slot.recurrenceDays.length === 0) {
            return {
                valid: false,
                error: "Pour une récurrence hebdomadaire, spécifiez au moins un jour",
            };
        }
        // Vérifier que les jours sont entre 1 et 7
        const invalidDays = slot.recurrenceDays.filter((d) => d < 1 || d > 7);
        if (invalidDays.length > 0) {
            return { valid: false, error: "Les jours doivent être entre 1 (Lundi) et 7 (Dimanche)" };
        }
    }

    // Vérifier que la date de fin est dans le futur
    if (isBefore(slot.recurrenceEndDate, new Date())) {
        return { valid: false, error: "La date de fin doit être dans le futur" };
    }

    return { valid: true };
}

/**
 * Découpe un créneau en slots d'1h ou 2h
 */
export function splitSlotIntoBookableSlots(
    startTime: string,
    endTime: string
): Array<{ start: string; end: string; duration: 1 | 2 }> {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const totalDuration = endMinutes - startMinutes;

    const slots: Array<{ start: string; end: string; duration: 1 | 2 }> = [];
    let currentMinutes = startMinutes;

    while (currentMinutes < endMinutes) {
        const remainingMinutes = endMinutes - currentMinutes;

        // Si au moins 2h disponibles, proposer un slot de 2h
        if (remainingMinutes >= 120) {
            const slotEndMinutes = currentMinutes + 120;
            slots.push({
                start: minutesToTime(currentMinutes),
                end: minutesToTime(slotEndMinutes),
                duration: 2,
            });
            currentMinutes += 120;
        }
        // Sinon, proposer un slot d'1h
        else if (remainingMinutes >= 60) {
            const slotEndMinutes = currentMinutes + 60;
            slots.push({
                start: minutesToTime(currentMinutes),
                end: minutesToTime(slotEndMinutes),
                duration: 1,
            });
            currentMinutes += 60;
        } else {
            // Moins d'1h restant, on arrête
            break;
        }
    }

    return slots;
}

/**
 * Convertit des minutes en format HH:mm
 */
function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
