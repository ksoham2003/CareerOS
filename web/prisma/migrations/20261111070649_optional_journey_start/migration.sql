-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "journeyStart" DROP NOT NULL,
ALTER COLUMN "journeyStart" DROP DEFAULT;

UPDATE "user_profiles"
SET "journeyStart" = NULL
WHERE "journeyStart" = '2026-11-11 00:00:00+00';
