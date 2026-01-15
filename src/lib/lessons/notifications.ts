import { sendEmail } from "@/lib/email";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { addDays, startOfHour, endOfHour } from "date-fns";

interface LessonInfo {
    date: Date;
    startTime: string;
    endTime: string;
    studentName: string;
    instructorName: string;
    location?: string;
    meetingPoint?: string;
}

/**
 * Notifier l'élève et l'instructeur d'une nouvelle réservation
 */
export async function notifyLessonBooked(
    studentEmail: string,
    instructorEmail: string,
    lesson: LessonInfo
) {
    const dateStr = format(lesson.date, "EEEE d MMMM yyyy", { locale: fr });
    const timeStr = `${lesson.startTime} - ${lesson.endTime}`;

    // Email à l'élève
    await sendEmail({
        to: studentEmail,
        subject: "Confirmation de réservation : Cours de conduite",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Votre cours de conduite est réservé !</h2>
        <p>Bonjour ${lesson.studentName},</p>
        <p>Votre réservation pour un cours de conduite a été enregistrée :</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date :</strong> ${dateStr}</p>
          <p><strong>Horaire :</strong> ${timeStr}</p>
          <p><strong>Instructeur :</strong> ${lesson.instructorName}</p>
          <p><strong>Lieu de rendez-vous :</strong> ${lesson.meetingPoint || lesson.location || "À définir avec l'instructeur"}</p>
        </div>
        <p><em>Attention : L'instructeur doit encore confirmer la séance.</em></p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });

    // Email à l'instructeur
    await sendEmail({
        to: instructorEmail,
        subject: "Nouvelle demande de cours : " + lesson.studentName,
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Nouvelle demande de cours reçue</h2>
        <p>Bonjour ${lesson.instructorName},</p>
        <p>L'élève <strong>${lesson.studentName}</strong> a réservé un créneau de conduite :</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date :</strong> ${dateStr}</p>
          <p><strong>Horaire :</strong> ${timeStr}</p>
          <p><strong>Lieu souhaité :</strong> ${lesson.meetingPoint || lesson.location || "À définir"}</p>
        </div>
        <p>Veuillez vous connecter à votre espace pour confirmer ou refuser cette demande.</p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier de la confirmation d'un cours par l'instructeur
 */
export async function notifyLessonConfirmed(studentEmail: string, lesson: LessonInfo) {
    const dateStr = format(lesson.date, "EEEE d MMMM yyyy", { locale: fr });

    await sendEmail({
        to: studentEmail,
        subject: "Cours de conduite confirmé !",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Bonne nouvelle ! Votre cours est confirmé</h2>
        <p>Bonjour ${lesson.studentName},</p>
        <p>Votre instructeur <strong>${lesson.instructorName}</strong> a confirmé votre cours de conduite le <strong>${dateStr}</strong> à <strong>${lesson.startTime}</strong>.</p>
        <p>N'oubliez pas d'être présent au point de rendez-vous 5 minutes à l'avance.</p>
        <p>Bonne séance !<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier de l'annulation d'un cours
 */
export async function notifyLessonCancelled(
    toEmail: string,
    recipientName: string,
    lesson: LessonInfo,
    cancelledByName: string,
    reason?: string
) {
    const dateStr = format(lesson.date, "EEEE d MMMM yyyy", { locale: fr });

    await sendEmail({
        to: toEmail,
        subject: "Annulation de votre cours de conduite",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Cours de conduite annulé</h2>
        <p>Bonjour ${recipientName},</p>
        <p>Le cours de conduite prévu le <strong>${dateStr}</strong> à <strong>${lesson.startTime}</strong> a été annulé par ${cancelledByName}.</p>
        ${reason ? `<p><strong>Raison :</strong> ${reason}</p>` : ""}
        <p>Vous pouvez consulter vos disponibilités pour réserver un nouveau créneau.</p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier d'une demande de changement d'instructeur (à l'admin)
 */
export async function notifyChangeRequest(
    adminEmail: string,
    studentName: string,
    reason: string
) {
    await sendEmail({
        to: adminEmail,
        subject: "Nouvelle demande de changement d'instructeur",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Demande de changement d'instructeur</h2>
        <p>Une nouvelle demande de changement d'instructeur a été soumise par l'élève <strong>${studentName}</strong>.</p>
        <p><strong>Raison invoquée :</strong> ${reason}</p>
        <p>Veuillez traiter cette demande depuis le tableau de bord administratif.</p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier l'élève que sa demande de changement a été approuvée
 */
export async function notifyChangeRequestApproved(
    studentEmail: string,
    studentName: string,
    newInstructorName: string
) {
    await sendEmail({
        to: studentEmail,
        subject: "Votre demande de changement d'instructeur a été approuvée",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Changement d'instructeur confirmé</h2>
        <p>Bonjour ${studentName},</p>
        <p>Votre demande de changement d'instructeur a été approuvée par l'administration.</p>
        <p>Votre nouvel instructeur est <strong>${newInstructorName}</strong>.</p>
        <p>Vous pouvez dès à présent consulter ses disponibilités et réserver votre prochain cours.</p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier l'élève que sa demande de changement a été rejetée
 */
export async function notifyChangeRequestRejected(
    studentEmail: string,
    studentName: string,
    reason?: string
) {
    await sendEmail({
        to: studentEmail,
        subject: "Information concernant votre demande de changement d'instructeur",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Mise à jour de votre demande de changement</h2>
        <p>Bonjour ${studentName},</p>
        <p>Votre demande de changement d'instructeur n'a pas pu être approuvée pour le moment.</p>
        ${reason ? `<p><strong>Commentaire de l'administration :</strong> ${reason}</p>` : ""}
        <p>N'hésitez pas à contacter le secrétariat pour plus d'informations.</p>
        <p>Cordialement,<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Notifier de l'approche d'un cours (Rappel 24h)
 */
export async function notifyLessonReminder(
    toEmail: string,
    recipientName: string,
    lesson: { date: Date; startTime: string; endTime: string; instructorName: string; meetingPoint?: string }
) {
    const dateStr = format(lesson.date, "EEEE d MMMM yyyy", { locale: fr });

    await sendEmail({
        to: toEmail,
        subject: "Rappel : Votre cours de conduite demain",
        html: `
      <div style="font-family: sans-serif; color: #334155;">
        <h2>Rappel de votre cours de conduite</h2>
        <p>Bonjour ${recipientName},</p>
        <p>Nous vous rappelons que vous avez un cours de conduite prévu demain, le <strong>${dateStr}</strong> à <strong>${lesson.startTime}</strong>.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Horaire :</strong> ${lesson.startTime} - ${lesson.endTime}</p>
          <p><strong>Lieu :</strong> ${lesson.meetingPoint || "À définir avec l'instructeur"}</p>
        </div>
        <p>N'oubliez pas d'être présent au point de rendez-vous 5 minutes à l'avance.</p>
        <p>Bonne séance !<br/>L'équipe SL Formations</p>
      </div>
    `,
    });
}

/**
 * Envoyer les rappels pour tous les cours prévus dans ~24h
 */
export async function sendLessonReminders() {
    const tomorrow = addDays(new Date(), 1);
    const start = startOfHour(tomorrow);
    const end = endOfHour(tomorrow);

    // Trouver tous les cours confirmés dans cette plage horaire
    const lessons = await prisma.drivingLesson.findMany({
        where: {
            date: {
                gte: start,
                lte: end,
            },
            status: "CONFIRMED",
            reminderSent: false,
        },
        include: {
            student: { select: { email: true, firstName: true, lastName: true } },
            instructor: { include: { user: { select: { email: true, firstName: true, lastName: true } } } },
        },
    });

    console.log(`[Reminders] Found ${lessons.length} lessons to notify`);

    for (const lesson of lessons) {
        try {
            // Rappel à l'élève
            await notifyLessonReminder(
                lesson.student.email!,
                `${lesson.student.firstName} ${lesson.student.lastName}`,
                {
                    date: lesson.date,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    instructorName: `${lesson.instructor.user.firstName} ${lesson.instructor.user.lastName}`,
                    meetingPoint: lesson.meetingPoint || "",
                }
            );

            // Rappel à l'instructeur
            await notifyLessonReminder(
                lesson.instructor.user.email,
                `${lesson.instructor.user.firstName} ${lesson.instructor.user.lastName}`,
                {
                    date: lesson.date,
                    startTime: lesson.startTime,
                    endTime: lesson.endTime,
                    instructorName: `${lesson.instructor.user.firstName} ${lesson.instructor.user.lastName}`,
                    meetingPoint: lesson.meetingPoint || "",
                }
            );

            // Marquer comme envoyé
            await prisma.drivingLesson.update({
                where: { id: lesson.id },
                data: { reminderSent: true },
            });
        } catch (err) {
            console.error(`[Reminders] Failed for lesson ${lesson.id}:`, err);
        }
    }

    return lessons.length;
}
