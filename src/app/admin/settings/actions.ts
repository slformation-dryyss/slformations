"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSystemSettingsAction(formData: FormData) {
    await requireAdmin();

    const settingsToUpdate = [
        "DEFAULT_LOCATION",
        "CONTACT_PHONE",
        "CONTACT_ADDRESS",
        "CONTACT_EMAIL",
        "MAIL_FROM_NAME",
        "MAIL_FROM_ADDRESS",
        "SOCIAL_FACEBOOK",
        "SOCIAL_INSTAGRAM",
        "SOCIAL_LINKEDIN",
        "SOCIAL_SNAPCHAT",
        "SOCIAL_TIKTOK",
        "MAINTENANCE_MODE"
    ];

    for (const key of settingsToUpdate) {
        if (formData.has(key)) {
            const value = formData.get(key) as string;
            // For checkboxes (MAINTENANCE_MODE), existence means "true", typically formData sends "on" or value
            // But here we rely on hidden input or strict string value. For optional, if it's not present we might want to clear it?
            // Simplest is explicit value passed from form.

            await prisma.systemSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        } else if (key === "MAINTENANCE_MODE") {
            // Checkbox unchecked might not send data, so assume false if missing but expected?
            // For now, let's rely on the form sending "false" via hidden input if needed, or just handle what's sent.
            // Safety: only update if present to avoid wiping via incomplete forms.
        }
    }

    // Handle Maintenance Mode specifically if it's a checkbox logic
    // The form sends "true" if checked. If unchecked, it sends nothing usually. 
    // We can force it:
    const maintenance = formData.get("MAINTENANCE_MODE") === "true" ? "true" : "false";
    await prisma.systemSetting.upsert({
        where: { key: "MAINTENANCE_MODE" },
        update: { value: maintenance },
        create: { key: "MAINTENANCE_MODE", value: maintenance }
    });


    revalidatePath("/admin/settings");
    revalidatePath("/");
}

