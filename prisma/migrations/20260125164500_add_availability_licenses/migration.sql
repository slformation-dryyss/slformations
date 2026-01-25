-- AlterTable
ALTER TABLE "InstructorAvailability" ADD COLUMN     "licenseTypes" TEXT[] DEFAULT ARRAY['B']::TEXT[];
