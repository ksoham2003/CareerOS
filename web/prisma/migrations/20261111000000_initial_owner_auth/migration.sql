-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_throttles" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_throttles_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "education" TEXT NOT NULL DEFAULT 'B.Tech Computer Science',
    "currentEmployer" TEXT NOT NULL DEFAULT 'Cognizant',
    "experienceMonths" INTEGER NOT NULL DEFAULT 8,
    "previousExperience" TEXT NOT NULL DEFAULT 'Frontend/full-stack internship at tCognition',
    "skills" TEXT[] DEFAULT ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL']::TEXT[],
    "aiExperience" TEXT NOT NULL DEFAULT 'Gemini API, RAG, Pinecone and AI application development',
    "primaryLanguage" TEXT NOT NULL DEFAULT 'Java',
    "secondaryLanguage" TEXT NOT NULL DEFAULT 'TypeScript',
    "aiLanguage" TEXT NOT NULL DEFAULT 'Python',
    "dsaLevel" TEXT NOT NULL DEFAULT 'Basic',
    "dailyMinutes" INTEGER NOT NULL DEFAULT 180,
    "careerObjective" TEXT NOT NULL DEFAULT 'SDE + AI Engineer',
    "targetSalaryLpa" INTEGER NOT NULL DEFAULT 50,
    "targetCompanies" TEXT NOT NULL DEFAULT 'Product companies, global technology companies and well-funded engineering startups',
    "journeyStart" TIMESTAMP(3) NOT NULL DEFAULT '2026-11-11 00:00:00 +00:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "restDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "sessionDuration" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_userId_expiresAt_idx" ON "sessions"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "login_throttles_resetAt_idx" ON "login_throttles"("resetAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
