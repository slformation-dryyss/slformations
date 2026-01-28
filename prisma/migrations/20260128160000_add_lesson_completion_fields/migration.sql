-- AddLessonCompletionFields
-- This migration adds fields to track lesson completion and instructor notes

ALTER TABLE "DrivingLesson" ADD COLUMN "studentProgress" TEXT;
ALTER TABLE "DrivingLesson" ADD COLUMN "areasToImprove" TEXT;
ALTER TABLE "DrivingLesson" ADD COLUMN "completedAt" TIMESTAMP;
