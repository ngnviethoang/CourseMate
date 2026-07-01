-- ============================================
-- SQL Script: Create Recommendation Tables (Simple Version)
-- CourseMate - Recommendation System
-- Note: Vector embeddings removed - use this if pgvector is not installed
-- ============================================

-- ============================================
-- Table: StudentPreferences
-- ============================================
CREATE TABLE IF NOT EXISTS "StudentPreferences" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "FavouriteCategories" text[] NOT NULL,
    "PreferredDifficulty" integer NULL,
    "LearningGoal" character varying(500) NOT NULL,
    "MinutesPerDay" integer NOT NULL,
    "SkillLevel" character varying(100) NOT NULL,
    "RecommendContests" boolean NOT NULL,
    "RecommendExercises" boolean NOT NULL,
    "AutoRefresh" boolean NOT NULL,
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_StudentPreferences" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_StudentPreferences_StudentId" ON "StudentPreferences" ("StudentId");

-- ============================================
-- Table: StudentSkillProfiles
-- ============================================
CREATE TABLE IF NOT EXISTS "StudentSkillProfiles" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "Category" character varying(100) NOT NULL,
    "Difficulty" integer NOT NULL,
    "TotalAttempts" integer NOT NULL,
    "PassedAttempts" integer NOT NULL,
    "AverageScore" double precision NOT NULL,
    "AverageRuntime" double precision NOT NULL,
    "MasteryScore" double precision NOT NULL,
    "IsWeakArea" boolean NOT NULL,
    "LastAttemptedAt" timestamp with time zone NOT NULL,
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_StudentSkillProfiles" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_StudentSkillProfiles_StudentId" ON "StudentSkillProfiles" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_StudentSkillProfiles_IsWeakArea" ON "StudentSkillProfiles" ("IsWeakArea") WHERE "IsWeakArea" = true;

-- ============================================
-- Table: RecommendationAnalytics
-- ============================================
CREATE TABLE IF NOT EXISTS "RecommendationAnalytics" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "EnrollmentId" uuid NULL,
    "ContentScore" double precision NOT NULL,
    "CollaborativeScore" double precision NOT NULL,
    "WeaknessScore" double precision NOT NULL,
    "PopularityScore" double precision NOT NULL,
    "FinalScore" double precision NOT NULL,
    "Source" character varying(100) NOT NULL,
    "Feedback" text NULL,
    "FeedbackTime" timestamp with time zone NULL,
    "EnrolledAt" timestamp with time zone NULL,
    "IsCompleted" boolean NOT NULL DEFAULT false,
    "CompletedAt" timestamp with time zone NULL,
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_RecommendationAnalytics" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_RecommendationAnalytics_StudentId" ON "RecommendationAnalytics" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_RecommendationAnalytics_CourseId" ON "RecommendationAnalytics" ("CourseId");
CREATE INDEX IF NOT EXISTS "IX_RecommendationAnalytics_FinalScore" ON "RecommendationAnalytics" ("FinalScore" DESC);

-- ============================================
-- Table: RecommendationLogs
-- ============================================
CREATE TABLE IF NOT EXISTS "RecommendationLogs" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "RecommendationType" character varying(100) NOT NULL,
    "Strategy" character varying(100) NOT NULL,
    "ResultCount" integer NOT NULL,
    "Payload" character varying(4000) NOT NULL,
    "TopScore" double precision NOT NULL,
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_RecommendationLogs" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_RecommendationLogs_StudentId" ON "RecommendationLogs" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_RecommendationLogs_StudentId_CreationTime" ON "RecommendationLogs" ("StudentId", "CreationTime" DESC);

DO $$
BEGIN
    RAISE NOTICE 'Recommendation tables created successfully (simple version without vector)!';
END $$;
