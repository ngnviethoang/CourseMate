SELECT 'ExerciseSubmissions' as table_name, COUNT(*) as count FROM "ExerciseSubmissions"
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM "Enrollments"
UNION ALL
SELECT 'Courses', COUNT(*) FROM "Courses"
UNION ALL
SELECT 'Categories', COUNT(*) FROM "Categories"
UNION ALL
SELECT 'Exercises', COUNT(*) FROM "Exercises";
