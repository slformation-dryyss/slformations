-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_vehicleId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Vehicle_status_idx";

-- AlterTable
DO $$ BEGIN
    ALTER TABLE "DrivingLesson" ADD COLUMN "vehicleId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "hasCompletedTour";
ALTER TABLE "User" ALTER COLUMN "primaryRole" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN IF EXISTS "features";
ALTER TABLE "Vehicle" DROP COLUMN IF EXISTS "image";
ALTER TABLE "Vehicle" DROP COLUMN IF EXISTS "pricePerDay";
ALTER TABLE "Vehicle" DROP COLUMN IF EXISTS "type";

DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "assignedInstructorId" TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "currentKm" INTEGER NOT NULL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "fuelType" TEXT NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "insuranceCompany" TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "insuranceExpiryDate" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "insurancePolicyNumber" TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "lastMaintenanceDate" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "licensePlate" TEXT NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "maintenanceDueKm" INTEGER;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "nextMaintenanceDate" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "technicalControlDate" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "transmission" TEXT NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD COLUMN "year" INTEGER NOT NULL;
EXCEPTION WHEN duplicate_column THEN null; END $$;

ALTER TABLE "Vehicle" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE IF NOT EXISTS "LegacyVehicle" (
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
CREATE TABLE IF NOT EXISTS "VehicleMaintenance" (
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
CREATE INDEX IF NOT EXISTS "LegacyVehicle_status_idx" ON "LegacyVehicle"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VehicleMaintenance_vehicleId_performedAt_idx" ON "VehicleMaintenance"("vehicleId", "performedAt");

-- CreateIndex
DROP INDEX IF EXISTS "Vehicle_licensePlate_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Vehicle_status_isAvailable_idx" ON "Vehicle"("status", "isAvailable");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Vehicle_assignedInstructorId_idx" ON "Vehicle"("assignedInstructorId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "LegacyVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "DrivingLesson" ADD CONSTRAINT "DrivingLesson_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_assignedInstructorId_fkey" FOREIGN KEY ("assignedInstructorId") REFERENCES "InstructorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "VehicleMaintenance" ADD CONSTRAINT "VehicleMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
