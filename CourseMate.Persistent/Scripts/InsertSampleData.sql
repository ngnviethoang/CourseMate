-- Insert sample data for testing recommendation API

-- 1. Create StudentPreferences for student1 (019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb)
INSERT INTO "StudentPreferences" ("Id", "StudentId", "FavouriteCategories", "PreferredDifficulty", "LearningGoal", "MinutesPerDay", "SkillLevel", "RecommendContests", "RecommendExercises", "AutoRefresh", "CreationTime", "IsDeleted")
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567801',
    '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb',
    ARRAY['Programming', 'Data Structures', 'Algorithms'],
    1,
    'Master competitive programming and data structures',
    120,
    'intermediate',
    true,
    true,
    true,
    NOW(),
    false
) ON CONFLICT DO NOTHING;

-- 2. Create StudentSkillProfiles for student1
INSERT INTO "StudentSkillProfiles" ("Id", "StudentId", "Category", "Difficulty", "TotalAttempts", "PassedAttempts", "AverageScore", "AverageRuntime", "MasteryScore", "IsWeakArea", "LastAttemptedAt", "CreationTime", "IsDeleted")
VALUES
    ('b2c3d4e5-f6a7-8901-bcde-f12345678012', '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb', 'Programming', 1, 5, 4, 85.5, 120.5, 0.75, false, NOW(), NOW(), false),
    ('c3d4e5f6-a7b8-9012-cdef-123456780123', '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb', 'Data Structures', 2, 3, 1, 55.0, 180.0, 0.35, true, NOW(), NOW(), false),
    ('d4e5f6a7-b8c9-0123-defa-234567801234', '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb', 'Algorithms', 1, 8, 7, 90.0, 95.0, 0.88, false, NOW(), NOW(), false),
    ('e5f6a7b8-c9d0-1234-efab-345678012345', '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb', 'Math', 1, 2, 1, 60.0, 200.0, 0.50, true, NOW(), NOW(), false)
ON CONFLICT DO NOTHING;

-- 3. Create some ExerciseSubmissions for student1 (so skill profile can work)
INSERT INTO "ExerciseSubmissions" ("Id", "ExerciseId", "Language", "Code", "IsPassed", "Score", "TotalTime", "TotalMemory", "UserId", "CreationTime", "LastModificationTime", "IsDeleted")
SELECT 
    md5(random()::text)::uuid,
    e."Id",
    'python',
    'def solution(): pass',
    true,
    85.0,
    120.5,
    256.0,
    '019ddd8c-f65a-7ad2-a4fa-1a6f00d0d1cb'::uuid,
    NOW() - (random() * interval '30 days'),
    NOW() - (random() * interval '30 days'),
    false
FROM "Exercises" e
CROSS JOIN generate_series(1, 3) AS s
ON CONFLICT DO NOTHING;

-- 4. Update Courses with AverageRating and EnrollmentCount (if not set)
UPDATE "Courses" SET "AverageRating" = 4.0 + random() * 1.0, "EnrollmentCount" = floor(random() * 200 + 10)::int WHERE "AverageRating" = 0;

SELECT 'Sample data inserted successfully' AS status;
