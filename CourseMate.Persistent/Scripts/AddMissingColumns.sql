-- Add UserId column for IMayHaveUser interface compatibility
ALTER TABLE "StudentPreferences" ADD COLUMN IF NOT EXISTS "UserId" uuid NULL;
ALTER TABLE "StudentSkillProfiles" ADD COLUMN IF NOT EXISTS "UserId" uuid NULL;
ALTER TABLE "RecommendationAnalytics" ADD COLUMN IF NOT EXISTS "UserId" uuid NULL;
ALTER TABLE "RecommendationLogs" ADD COLUMN IF NOT EXISTS "UserId" uuid NULL;

-- Also add AverageRating and EnrollmentCount to Courses table if missing
ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "AverageRating" double precision NOT NULL DEFAULT 0;
ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "EnrollmentCount" integer NOT NULL DEFAULT 0;

SELECT 'UserId and Courses columns added successfully' AS status;
