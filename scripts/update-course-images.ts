
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🖼️  Starting course image update...');

    // Available Images: permis_b, moto, caces, ssiap, secourisme (PNG format)
    // Fallbacks: vtc -> permis_b, poids_lourds -> caces, remorque -> permis_b

    const mappings = [
        {
            keywords: ['permis b', 'conduite accompagnée', 'aac'],
            exclude: ['remorque', 'b96'],
            imagePath: '/images/courses/permis_b.png' // Generated
        },
        {
            keywords: ['moto', 'permis a', '125'],
            exclude: [],
            imagePath: '/images/courses/moto.png' // Generated
        },
        {
            keywords: ['caces', 'chariot', 'nacelle'],
            exclude: [],
            imagePath: '/images/courses/caces.png' // Generated
        },
        {
            keywords: ['ssiap', 'incendie', 'feu'],
            exclude: [],
            imagePath: '/images/courses/ssiap.png' // Generated
        },
        {
            keywords: ['secourisme', 'sst', 'gestes qui sauvent'],
            exclude: [],
            imagePath: '/images/courses/secourisme.png' // Generated
        },
        {
            keywords: ['vtc', 'taxi', 't3p'],
            exclude: [],
            imagePath: '/images/courses/permis_b.png' // Fallback to Car
        },
        {
            keywords: ['poids lourd', 'permis c', 'permis d', 'fimo', 'fco'],
            exclude: ['remorque', 'permis ce'],
            imagePath: '/images/courses/caces.png' // Fallback to Industrial/Logistics
        },
        {
            keywords: ['remorque', 'be', 'b96', 'permis ce'],
            exclude: [],
            imagePath: '/images/courses/permis_b.png' // Fallback to Car
        }
    ];

    const courses = await prisma.course.findMany({
        select: { id: true, title: true, slug: true, type: true }
    });

    console.log(`🔍 Analying ${courses.length} courses...`);

    for (const course of courses) {
        let matchedImage = null;
        const titleLower = course.title.toLowerCase();
        const typeLower = course.type.toLowerCase();
        const slugLower = (course.slug || '').toLowerCase();

        // Strategy 1: Match by Mapping Keywords
        for (const mapping of mappings) {
            const matchesKeyword = mapping.keywords.some(k =>
                titleLower.includes(k) || typeLower.includes(k) || slugLower.includes(k)
            );
            const isExcluded = mapping.exclude.some(e => titleLower.includes(e));

            if (matchesKeyword && !isExcluded) {
                matchedImage = mapping.imagePath;
                break;
            }
        }

        // Strategy 2: Fallback by Type if no keyword match
        if (!matchedImage) {
            if (typeLower.includes('permis')) matchedImage = '/images/courses/permis_b.png';
            else if (typeLower.includes('caces')) matchedImage = '/images/courses/caces.png';
            else if (typeLower.includes('incendie')) matchedImage = '/images/courses/ssiap.png';
            else if (typeLower.includes('secourisme')) matchedImage = '/images/courses/secourisme.png';
            else if (typeLower.includes('vtc')) matchedImage = '/images/courses/permis_b.png';
            else if (typeLower.includes('transport')) matchedImage = '/images/courses/caces.png';
        }

        if (matchedImage) {
            await prisma.course.update({
                where: { id: course.id },
                data: { imageUrl: matchedImage }
            });
            console.log(`✅ Updated [${course.title}]: ${matchedImage}`);
        } else {
            console.log(`⚠️  No match found for [${course.title}] (${course.type})`);
        }
    }

    console.log('✨ Image update complete!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
