-- Add IsDeleted columns for soft delete support
ALTER TABLE "StudentPreferences" ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false;
ALTER TABLE "StudentSkillProfiles" ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false;
ALTER TABLE "RecommendationAnalytics" ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false;
ALTER TABLE "RecommendationLogs" ADD COLUMN IF NOT EXISTS "IsDeleted" boolean NOT NULL DEFAULT false;

SELECT 'IsDeleted columns added successfully' AS status;
