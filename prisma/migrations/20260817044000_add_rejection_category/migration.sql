-- CreateEnum
CREATE TYPE "RejectionCategory" AS ENUM (
  'TECHNICAL_SKILLS',
  'SYSTEM_DESIGN',
  'PROBLEM_SOLVING',
  'COMMUNICATION',
  'EXPERIENCE_FIT',
  'COMPENSATION',
  'POSITION_CLOSED',
  'OTHER'
);

-- AlterTable
ALTER TABLE "job_applications"
ADD COLUMN "rejection_category" "RejectionCategory";
