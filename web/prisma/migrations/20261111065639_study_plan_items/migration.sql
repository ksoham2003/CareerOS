-- AlterTable
ALTER TABLE "study_sessions" ADD COLUMN     "studyPlanItemId" TEXT;

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "primaryLanguage" DROP NOT NULL,
ALTER COLUMN "primaryLanguage" DROP DEFAULT,
ALTER COLUMN "secondaryLanguage" DROP NOT NULL,
ALTER COLUMN "secondaryLanguage" DROP DEFAULT,
ALTER COLUMN "aiLanguage" DROP NOT NULL,
ALTER COLUMN "aiLanguage" DROP DEFAULT,
ALTER COLUMN "dsaLevel" DROP NOT NULL,
ALTER COLUMN "dsaLevel" DROP DEFAULT,
ALTER COLUMN "dailyMinutes" DROP NOT NULL,
ALTER COLUMN "dailyMinutes" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_settings" ALTER COLUMN "sessionDuration" DROP NOT NULL,
ALTER COLUMN "sessionDuration" DROP DEFAULT;

-- Clear only the verified scaffold defaults currently stored in the owner profile.
UPDATE "user_profiles"
SET "primaryLanguage" = NULL,
        "secondaryLanguage" = NULL,
        "aiLanguage" = NULL,
        "dsaLevel" = NULL,
        "dailyMinutes" = NULL
WHERE "primaryLanguage" = 'Java'
    AND "secondaryLanguage" = 'TypeScript'
    AND "aiLanguage" = 'Python'
    AND "dsaLevel" = 'Basic'
    AND "dailyMinutes" = 180;

UPDATE "user_settings"
SET "sessionDuration" = NULL
WHERE "sessionDuration" = 60;

-- CreateTable
CREATE TABLE "study_plan_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "plannedMinutes" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_plan_items_userId_position_createdAt_idx" ON "study_plan_items"("userId", "position", "createdAt");

-- CreateIndex
CREATE INDEX "study_sessions_userId_studyPlanItemId_idx" ON "study_sessions"("userId", "studyPlanItemId");

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_studyPlanItemId_fkey" FOREIGN KEY ("studyPlanItemId") REFERENCES "study_plan_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_items" ADD CONSTRAINT "study_plan_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
