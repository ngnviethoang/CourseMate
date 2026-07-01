-- ============================================
-- SQL Script: Create Recommendation Tables
-- CourseMate - Recommendation System
-- ============================================

-- Enable pgvector extension (if not exists)
CREATE EXTENSION IF NOT EXISTS vector;

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

COMMENT ON TABLE "StudentPreferences" IS 'Stores explicit preference signals from students: favourite categories, preferred difficulty, learning goals, time budget.';

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

COMMENT ON TABLE "StudentSkillProfiles" IS 'Tracks student performance per category/difficulty to identify weak areas for recommendations.';

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
CREATE INDEX IF NOT EXISTS "IX_RecommendationAnalytics_Feedback" ON "RecommendationAnalytics" ("Feedback") WHERE "Feedback" IS NOT NULL;

COMMENT ON TABLE "RecommendationAnalytics" IS 'Stores recommendation results for analytics, A/B testing and preventing duplicate recommendations.';

-- ============================================
-- Table: RecommendationLogs
-- ============================================
CREATE TABLE IF NOT EXISTS "RecommendationLogs" (
    "Id" uuid NOT NULL,
    "StudentId" uuid NOT NULL,
    "RecommendationType" character varying(100) NOT NULL,
    "Strategy" character varying(100) NOT NULL,
    "ResultCount" integer NOT NULL,
    "Payload" character varying(2000) NOT NULL,
    "TopScore" double precision NOT NULL,
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_RecommendationLogs" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_RecommendationLogs_StudentId" ON "RecommendationLogs" ("StudentId");
CREATE INDEX IF NOT EXISTS "IX_RecommendationLogs_StudentId_CreationTime" ON "RecommendationLogs" ("StudentId", "CreationTime" DESC);

COMMENT ON TABLE "RecommendationLogs" IS 'Snapshot of recommendation results for analytics and preventing regeneration of identical recommendations.';

-- ============================================
-- Table: CourseEmbeddings (for content-based filtering)
-- ============================================
CREATE TABLE IF NOT EXISTS "CourseEmbeddings" (
    "Id" uuid NOT NULL,
    "CourseId" uuid NOT NULL,
    "Embedding" vector(1536) NULL,  -- OpenAI ada-002 embedding dimension
    "CreationTime" timestamp with time zone NOT NULL DEFAULT NOW(),
    "LastModificationTime" timestamp with time zone NULL,
    CONSTRAINT "PK_CourseEmbeddings" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_CourseEmbeddings_CourseId" ON "CourseEmbeddings" ("CourseId");
CREATE INDEX IF NOT EXISTS "IX_CourseEmbeddings_Embedding" ON "CourseEmbeddings" USING ivfflat ("Embedding" vector_cosine_ops) WITH (lists = 100);

COMMENT ON TABLE "CourseEmbeddings" IS 'Stores course embeddings for content-based similarity search.';

-- ============================================
-- Foreign Key Constraints (optional, for referential integrity)
-- ============================================

-- StudentPreferences -> User
-- ALTER TABLE "StudentPreferences" ADD CONSTRAINT "FK_StudentPreferences_Users_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

-- StudentSkillProfiles -> User
-- ALTER TABLE "StudentSkillProfiles" ADD CONSTRAINT "FK_StudentSkillProfiles_Users_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

-- RecommendationAnalytics -> User
-- ALTER TABLE "RecommendationAnalytics" ADD CONSTRAINT "FK_RecommendationAnalytics_Users_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

-- RecommendationAnalytics -> Course
-- ALTER TABLE "RecommendationAnalytics" ADD CONSTRAINT "FK_RecommendationAnalytics_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES "Courses" ("Id") ON DELETE CASCADE;

-- RecommendationLogs -> User
-- ALTER TABLE "RecommendationLogs" ADD CONSTRAINT "FK_RecommendationLogs_Users_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Users" ("Id") ON DELETE CASCADE;

-- CourseEmbeddings -> Course
-- ALTER TABLE "CourseEmbeddings" ADD CONSTRAINT "FK_CourseEmbeddings_Courses_CourseId" FOREIGN KEY ("CourseId") REFERENCES "Courses" ("Id") ON DELETE CASCADE;

-- ============================================
-- Sample Data for Testing (Optional)
-- ============================================

-- Insert sample student preferences (uncomment to use)
-- INSERT INTO "StudentPreferences" ("Id", "StudentId", "FavouriteCategories", "PreferredDifficulty", "LearningGoal", "MinutesPerDay", "SkillLevel", "RecommendContests", "RecommendExercises", "AutoRefresh")
-- VALUES
--     ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', ARRAY['Programming', 'Data Science'], 1, 'Learn Python for data analysis', 60, 'beginner', true, true, true);

-- ============================================
-- Completion Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Recommendation tables created successfully!';
END $$;
