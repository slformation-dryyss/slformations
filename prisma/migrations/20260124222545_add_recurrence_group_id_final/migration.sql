/*
  Warnings:

  - You are about to drop the column `recurrenceDays` on the `InstructorAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceEndDate` on the `InstructorAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `recurrencePattern` on the `InstructorAvailability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InstructorAvailability" DROP COLUMN "recurrenceDays",
DROP COLUMN "recurrenceEndDate",
DROP COLUMN "recurrencePattern",
ADD COLUMN     "recurrenceGroupId" TEXT;
