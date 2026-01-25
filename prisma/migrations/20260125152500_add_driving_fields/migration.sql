-- AlterTable
ALTER TABLE "User" ADD COLUMN     "drivingBalance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "drivingHours" INTEGER DEFAULT 0;
