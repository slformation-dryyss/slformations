
import { PrismaClient } from '@prisma/client';
import { addDays, setHours, setMinutes } from 'date-fns';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding Course Sessions...');

  // Helper to get course by slug
  const getCourse = async (slug: string) => prisma.course.findUnique({ where: { slug } });

  // 1. CACES Sessions
  const caces1A = await getCourse('caces-r489-1a');
  const caces3 = await getCourse('caces-r489-3');
  const caces5 = await getCourse('caces-r489-5');

  if (caces1A) {
    await createSessions(caces1A.id, [
        { start: nextDate(5), duration: 2, location: 'Centre Épinay-sur-Seine' },
        { start: nextDate(20), duration: 2, location: 'Centre Épinay-sur-Seine' },
    ]);
  }
  if (caces3) {
    await createSessions(caces3.id, [
        { start: nextDate(2), duration: 3, location: 'Centre Épinay-sur-Seine' },
        { start: nextDate(15), duration: 3, location: 'Centre Épinay-sur-Seine' },
    ]);
  }

  // 2. Incendie Sessions (SSIAP / EPI)
  const ssiap1 = await getCourse('ssiap-1');
  const epi = await getCourse('equipier-premiere-intervention-epi');

  if (ssiap1) {
    await createSessions(ssiap1.id, [
        { start: nextDate(10), duration: 10, location: 'Paris 12ème' },
        { start: nextDate(40), duration: 10, location: 'Paris 12ème' },
    ]);
  }
  if (epi) {
      await createSessions(epi.id, [
          { start: nextDate(7), duration: 1, location: 'Sur site client (Intra)' },
          { start: nextDate(14), duration: 1, location: 'Centre Épinay-sur-Seine' }
      ]);
  }

  // 3. VTC Sessions
  const vtc = await getCourse('formation-vtc-complete');
  if (vtc) {
      await createSessions(vtc.id, [
          { start: nextDate(3), duration: 10, location: 'Centre Villepinte' },
          { start: nextDate(25), duration: 10, location: 'Centre Villepinte' },
      ]);
  }

  // 4. Habilitation Electrique
  const h0b0 = await getCourse('habilitation-h0-b0');
  const bsbe = await getCourse('habilitation-bs-be-manoeuvre');
  
  if (h0b0) {
      await createSessions(h0b0.id, [
          { start: nextDate(6), duration: 1, location: 'Centre Épinay-sur-Seine' },
      ]);
  }
  if (bsbe) {
      await createSessions(bsbe.id, [
          { start: nextDate(8), duration: 2, location: 'Centre Épinay-sur-Seine' },
      ]);
  }

  // 5. Recuperation Points
  const points = await getCourse('stage-recuperation-points');
  if (points) {
      await createSessions(points.id, [
          { start: nextDate(4), duration: 2, location: 'Centre Épinay-sur-Seine' },
          { start: nextDate(11), duration: 2, location: 'Centre Épinay-sur-Seine' },
          { start: nextDate(18), duration: 2, location: 'Centre Bobigny' },
          { start: nextDate(25), duration: 2, location: 'Centre Paris 14ème' },
          { start: nextDate(32), duration: 2, location: 'Centre Villepinte' },
      ]);
  }

  console.log('Sessions seeded.');
}

// Helpers
function nextDate(daysFromNow: number) {
    const d = addDays(new Date(), daysFromNow);
    return setHours(setMinutes(d, 0), 9); // 9:00 AM
}

async function createSessions(courseId: string, sessions: { start: Date, duration: number, location: string }[]) {
    for (const s of sessions) {
        const endDate = addDays(s.start, s.duration - 1); // simple duration in days
        // Set end time to 17:00
        const endDateTime = setHours(setMinutes(endDate, 0), 17);

        await prisma.courseSession.create({
            data: {
                courseId,
                startDate: s.start,
                endDate: endDateTime,
                location: s.location,
                maxSpots: 10,
                bookedSpots: Math.floor(Math.random() * 5),
                isPublished: true
            }
        });
        console.log(` > Session created for course ${courseId} at ${s.start.toISOString().split('T')[0]}`);
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
