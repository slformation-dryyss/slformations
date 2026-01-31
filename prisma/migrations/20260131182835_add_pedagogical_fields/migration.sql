-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "durationText" TEXT DEFAULT 'Variable',
ADD COLUMN     "formatText" TEXT DEFAULT 'Présentiel',
ADD COLUMN     "objectives" TEXT DEFAULT 'Maîtriser les compétences fondamentales et se préparer à la certification.',
ADD COLUMN     "prospects" TEXT DEFAULT 'Insertion professionnelle immédiate dans le secteur visé.',
ADD COLUMN     "targetAudience" TEXT DEFAULT 'Particuliers ou professionnels souhaitant se former aux métiers du transport et de la sécurité.';
