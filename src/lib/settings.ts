import { prisma } from "./prisma";

/**
 * Récupère un paramètre système depuis la base de données avec une valeur par défaut
 */
export async function getSystemSetting(key: string, defaultValue: string): Promise<string> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key },
        });
        return setting?.value ?? defaultValue;
    } catch (error) {
        console.error(`Error fetching system setting ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Récupère un paramètre système sous forme de nombre
 */
export async function getSystemSettingNumber(key: string, defaultValue: number): Promise<number> {
    const value = await getSystemSetting(key, defaultValue.toString());
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
}

/**
 * Constantes pour les clés de paramètres
 */
export const SETTINGS = {
    BOOKING_MIN_ADVANCE_HOURS: "BOOKING_MIN_ADVANCE_HOURS",
    // Ajouter d'autres clés ici au besoin
} as const;

/**
 * Valeurs par défaut
 */
export const SETTING_DEFAULTS = {
    [SETTINGS.BOOKING_MIN_ADVANCE_HOURS]: 48,
} as const;
