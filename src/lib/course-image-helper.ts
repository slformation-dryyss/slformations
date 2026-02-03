
export function getCourseImage(course: { title?: string | null; type?: string | null; slug?: string | null; imageUrl?: string | null }): string {
    // If a valid URL is already present and seemingly correct (not a placeholder we want to replace), use it.
    // However, since we want to FORCE the new images for now (as the DB has old placeholders), we might prioritize local logic.
    // For safety, let's prioritize local logic if it matches our new categories, otherwise fallback to existing URL or default.

    const titleLower = (course.title || '').toLowerCase();
    const typeLower = (course.type || '').toLowerCase();
    const slugLower = (course.slug || '').toLowerCase();

    // Mappings (Same logic as the script)
    const mappings = [
        {
            keywords: ['permis b', 'conduite accompagnée', 'aac'],
            exclude: ['remorque', 'b96'],
            imagePath: '/images/courses/permis_b.png'
        },
        {
            keywords: ['moto', 'permis a', '125'],
            exclude: [],
            imagePath: '/images/courses/moto.png'
        },
        {
            keywords: ['caces', 'chariot', 'nacelle', 'poids lourd', 'transport', 'fimo', 'fco'],
            exclude: ['remorque'],
            imagePath: '/images/courses/caces.png'
        },
        {
            keywords: ['ssiap', 'incendie', 'feu'],
            exclude: [],
            imagePath: '/images/courses/ssiap.png'
        },
        {
            keywords: ['secourisme', 'sst', 'gestes qui sauvent'],
            exclude: [],
            imagePath: '/images/courses/secourisme.png'
        },
        {
            keywords: ['vtc', 'taxi', 't3p'],
            exclude: [],
            imagePath: '/images/courses/permis_b.png' // Fallback VTC -> Car
        },
        {
            keywords: ['remorque', 'be', 'b96', 'permis ce'],
            exclude: [],
            imagePath: '/images/courses/permis_b.png' // Fallback Trailer -> Car
        }
    ];

    for (const mapping of mappings) {
        const matchesKeyword = mapping.keywords.some(k =>
            titleLower.includes(k) || typeLower.includes(k) || slugLower.includes(k)
        );
        const isExcluded = mapping.exclude.some(e => titleLower.includes(e));

        if (matchesKeyword && !isExcluded) {
            return mapping.imagePath;
        }
    }

    // Fallback to existing URL or a generic default if absolutely nothing matches
    return course.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop';
}
