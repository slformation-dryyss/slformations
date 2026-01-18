/*
  Warnings:

  - You are about to drop the column `hasCompletedTour` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerDay` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[licensePlate]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Made the column `primaryRole` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fuelType` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_vehicleId_fkey";

-- DropIndex
DROP INDEX "Vehicle_status_idx";

-- AlterTable
ALTER TABLE "DrivingLesson" ADD COLUMN     "vehicleId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "hasCompletedTour",
ALTER COLUMN "primaryRole" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN IF EXISTS "features",
DROP COLUMN IF EXISTS "image",
DROP COLUMN IF EXISTS "pricePerDay",
DROP COLUMN IF EXISTS "type",
ADD COLUMN     "assignedInstructorId" TEXT,
ADD COLUMN     "currentKm" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "insuranceCompany" TEXT,
ADD COLUMN     "insuranceExpiryDate" TIMESTAMP(3),
ADD COLUMN     "insurancePolicyNumber" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "licensePlate" TEXT NOT NULL,
ADD COLUMN     "maintenanceDueKm" INTEGER,
ADD COLUMN     "nextMaintenanceDate" TIMESTAMP(3),
ADD COLUMN     "technicalControlDate" TIMESTAMP(3),
ADD COLUMN     "transmission" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "LegacyVehicle" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "image" TEXT,
    "features" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegacyVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleMaintenance" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "performedBy" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "kilometers" INTEGER,
    "invoiceNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LegacyVehicle_status_idx" ON "LegacyVehicle"("status");

-- CreateIndex
CREATE INDEX "VehicleMaintenance_vehicleId_performedAt_idx" ON "VehicleMaintenance"("vehicleId", "performedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE INDEX "Vehicle_status_isAvailable_idx" ON "Vehicle"("status", "isAvailable");

-- CreateIndex
CREATE INDEX "Vehicle_assignedInstructorId_idx" ON "Vehicle"("assignedInstructorId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "LegacyVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLesson" ADD CONSTRAINT "DrivingLesson_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_assignedInstructorId_fkey" FOREIGN KEY ("assignedInstructorId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleMaintenance" ADD CONSTRAINT "VehicleMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
