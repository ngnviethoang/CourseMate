-- =============================================================================
-- CourseMate - Seed Data (ALL-IN-ONE)
-- Mục đích: Tạo dữ liệu mẫu đầy đủ cho hệ thống Recommendation:
--   1. Roles (Admin / Manager / Instructor / Student)
--   2. Users mặc định với password hash ASP.NET Core Identity v3
--   3. Categories mẫu
--   4. 100 Exercises (8 chủ đề × ~13 bài × 3 độ khó)
--      Mỗi bài: 1 Example, 3 TestCases, 3 DefaultCodes (cpp/java/python)
--   5. 10 Contests (Draft / Upcoming / Ongoing / Ended)
--   6. Liên kết ContestExercises (~10 bài / contest)
--
-- Tài khoản mặc định (password: User@123 cho tất cả):
--   admin       - Admin
--   manager     - Admin
--   instructor1 - Instructor   <- CreatorId mặc định cho exercises/contests
--   instructor2 - Instructor
--   instructor3 - Instructor
--   student1    - Student
--   student2    - Student
--   student3    - Student
--
-- Cách chạy:
--   psql -U postgres -d CourseMateV2 -f seed_exercises_contests.sql
--   (hoặc mở pgAdmin → Query Tool → mở file → Execute)
--
-- Idempotent: chạy nhiều lần vẫn an toàn (dùng ON CONFLICT hoặc check trước).
-- =============================================================================

BEGIN;

-- =============================================================================
-- BƯỚC 1: Tạo Roles
-- =============================================================================
INSERT INTO "AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp")
VALUES
    (gen_random_uuid(), 'Admin',       'ADMIN',       gen_random_uuid()::text),
    (gen_random_uuid(), 'Manager',     'MANAGER',     gen_random_uuid()::text),
    (gen_random_uuid(), 'Instructor',  'INSTRUCTOR',  gen_random_uuid()::text),
    (gen_random_uuid(), 'Student',     'STUDENT',     gen_random_uuid()::text)
ON CONFLICT ("NormalizedName") DO NOTHING;

-- =============================================================================
-- BƯỚC 2: Tạo Users mặc định
-- Password hash đã được generate sẵn bằng ASP.NET Core Identity v3 (PBKDF2+SHA256).
-- =============================================================================
INSERT INTO "AspNetUsers" (
    "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail",
    "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
    "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled",
    "LockoutEnd", "LockoutEnabled", "AccessFailedCount"
) VALUES
    (gen_random_uuid(), 'admin',       'ADMIN',       'admin@example.com',       'ADMIN@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEMTcLoVQxxaygWXsg0GOL9CK5UjKhQQ8smENg3jviCUyAOcpN4qehvbU7MzsGnockg==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'manager',     'MANAGER',     'manager@example.com',     'MANAGER@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAECah13bRJ5KpiNI3V7Ll/CVCC6cNymKGNyA0bD6N4BKW1wwyCD3wMj2/swvO3GHdkw==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'instructor1', 'INSTRUCTOR1', 'instructor1@example.com', 'INSTRUCTOR1@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEIrQlFeFc9YEjGjiT2d5RBirw2gLmunYqdynG/+v0eUduOtW7VQ60n5epk85d6lbCw==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'instructor2', 'INSTRUCTOR2', 'instructor2@example.com', 'INSTRUCTOR2@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEL4CrBkk+z6lgjFZ2326zpWeoIQmNGlUtHi6yc6gOV2pXY7lRae+ylOcHs5g50JqRw==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'instructor3', 'INSTRUCTOR3', 'instructor3@example.com', 'INSTRUCTOR3@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAELjhpzdelC37lJFDCX6UIr7SKFAOjaOc/wXud76bHs2eTr8k9vKkLaG/Y/vKs3z8/w==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'student1',    'STUDENT1',    'student1@example.com',    'STUDENT1@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEP81WBrNCSMhdAhJ5QTDBayOuz7Y9HfCBKF2glrNIxYZN3vRUQA1eD+nNhsuDwz20Q==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'student2',    'STUDENT2',    'student2@example.com',    'STUDENT2@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEN1qNO5x1xc1wJx7bwTEYnjOxsfORGMGfMTkzOsUhg/VbatCyAlw2vMMS2GwKAgPKQ==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0),

    (gen_random_uuid(), 'student3',    'STUDENT3',    'student3@example.com',    'STUDENT3@EXAMPLE.COM',
     true, 'AQAAAAIAAYagAAAAEFIHsghHOQggxxQGkgpC+uoU0K38JEeQOuMFtAj1/1+RvVBBSpj31ztLjiQoeegoYA==',
     gen_random_uuid()::text, gen_random_uuid()::text,
     NULL, false, false, NULL, true, 0)
ON CONFLICT ("NormalizedUserName") DO NOTHING;

-- =============================================================================
-- BƯỚC 3: Gán Role cho Users
-- =============================================================================
INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id"
FROM "AspNetUsers" u, "AspNetRoles" r
WHERE u."UserName" IN ('admin','manager')        AND r."NormalizedName" = 'ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id"
FROM "AspNetUsers" u, "AspNetRoles" r
WHERE u."UserName" IN ('instructor1','instructor2','instructor3') AND r."NormalizedName" = 'INSTRUCTOR'
ON CONFLICT DO NOTHING;

INSERT INTO "AspNetUserRoles" ("UserId", "RoleId")
SELECT u."Id", r."Id"
FROM "AspNetUsers" u, "AspNetRoles" r
WHERE u."UserName" IN ('student1','student2','student3') AND r."NormalizedName" = 'STUDENT'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- BƯỚC 4: Tạo Categories mẫu
-- =============================================================================
INSERT INTO "Categories" ("Id", "Name", "Description", "IsActive", "CreationTime", "IsDeleted")
VALUES
    (gen_random_uuid(), 'Lap trinh C',          'Ngon ngu lap trinh C co ban va nang cao',     true, NOW(), false),
    (gen_random_uuid(), 'Thuat toan',           'Cau truc du lieu va thuat toan',               true, NOW(), false),
    (gen_random_uuid(), 'Lap trinh Web',        'HTML, CSS, JavaScript va cac framework',       true, NOW(), false),
    (gen_random_uuid(), 'Co so du lieu',        'SQL, NoSQL va thiet ke CSDL',                  true, NOW(), false),
    (gen_random_uuid(), 'Tri tue nhan tao',     'Machine Learning va Deep Learning',            true, NOW(), false),
    (gen_random_uuid(), 'Lap trinh Python',     'Ngon ngu Python tu co ban den nang cao',       true, NOW(), false),
    (gen_random_uuid(), 'DevOps & Cloud',       'Docker, Kubernetes, AWS, Azure',               true, NOW(), false),
    (gen_random_uuid(), 'Mobile Development',   'iOS, Android va Cross-platform',               true, NOW(), false)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- BƯỚC 5: Lưu CreatorId (instructor1) vào session
-- =============================================================================
DO $$
DECLARE
    v_creator_id UUID;
BEGIN
    SELECT "Id" INTO v_creator_id FROM "AspNetUsers" WHERE "UserName" = 'instructor1' LIMIT 1;
    PERFORM set_config('app.creator_id', COALESCE(v_creator_id::text, gen_random_uuid()::text), false);
END $$;

-- =============================================================================
-- BƯỚC 6: Seed 100 EXERCISES (8 chủ đề × 13 bài = 104 bài)
-- =============================================================================
-- Phân bố độ khó: 5 Easy + 5 Medium + 3 Hard mỗi chủ đề

DO $$
DECLARE
    v_creator_id UUID := current_setting('app.creator_id')::uuid;
    v_existing INT;
    v_categories TEXT[] := ARRAY['array','string','math','sorting','searching','dp','graph','greedy'];
    v_cat TEXT;
    v_idx INT;
    v_diff INT;
    v_diff_name TEXT;
    v_exercise_id UUID;
BEGIN
    SELECT COUNT(*) INTO v_existing FROM "Exercises";
    IF v_existing >= 100 THEN
        RAISE NOTICE '✓ Exercises: da co %, bo qua.', v_existing;
        RETURN;
    END IF;

    RAISE NOTICE '→ Seeding 100 Exercises...';

    FOREACH v_cat IN ARRAY v_categories LOOP
        FOR v_idx IN 1..13 LOOP
            IF v_idx <= 5 THEN v_diff := 0; v_diff_name := 'Easy';
            ELSIF v_idx <= 10 THEN v_diff := 1; v_diff_name := 'Medium';
            ELSE v_diff := 2; v_diff_name := 'Hard';
            END IF;

            v_exercise_id := gen_random_uuid();

            INSERT INTO "Exercises" ("Id","Title","Description","Difficulty","Category","CreatorId","Constraints","Hints","CreationTime","IsDeleted")
            VALUES (
                v_exercise_id,
                v_cat || ' - bai ' || v_idx || ' (' || v_diff_name || ')',
                'Bai tap chu de ' || v_cat || ', muc do ' ||
                    CASE v_diff WHEN 0 THEN 'de' WHEN 1 THEN 'trung binh' ELSE 'kho' END ||
                    '. Doc ky de bai, phan tich vi du va nop code dung dinh dang.',
                v_diff, v_cat, v_creator_id,
                '["Thoi gian: 1 giay","Bo nho: 256 MB","Doc input tu stdin, ghi output ra stdout"]'::jsonb,
                '["Doc ky vi du de hieu format input/output","Chu y xu ly edge cases (mang rong, so am, v.v.)"]'::jsonb,
                NOW(), false
            );

            -- 1 Example
            INSERT INTO "ExerciseExamples" ("Id","Input","Output","Explanation","ExerciseId","CreationTime","IsDeleted")
            VALUES (
                gen_random_uuid(),
                '5' || E'\n' || '1 2 3 4 5',
                '15',
                'Doc n=5 va day 1 2 3 4 5, ket qua la tong = 1+2+3+4+5 = 15',
                v_exercise_id, NOW(), false
            );

            -- 3 TestCases: 1 công khai + 2 ẩn
            INSERT INTO "ExerciseTestCases" ("Id","ExerciseId","Input","ExpectedOutput","Description","IsHidden","Order","CreationTime","IsDeleted")
            VALUES (gen_random_uuid(), v_exercise_id, '5' || E'\n' || '1 2 3 4 5', '15', 'Test case co ban',         false, 1, NOW(), false);

            INSERT INTO "ExerciseTestCases" ("Id","ExerciseId","Input","ExpectedOutput","Description","IsHidden","Order","CreationTime","IsDeleted")
            VALUES (gen_random_uuid(), v_exercise_id, '3' || E'\n' || '10 20 30',  '60', 'Test case so lon',         true,  2, NOW(), false);

            INSERT INTO "ExerciseTestCases" ("Id","ExerciseId","Input","ExpectedOutput","Description","IsHidden","Order","CreationTime","IsDeleted")
            VALUES (gen_random_uuid(), v_exercise_id, '1' || E'\n' || '42',        '42', 'Test case bien - 1 phan tu', true,  3, NOW(), false);

            -- 3 DefaultCodes: C++ / Java / Python
            INSERT INTO "ExerciseDefaultCodes" ("Id","ExerciseId","Language","StarterCode","CreationTime","IsDeleted")
            VALUES (
                gen_random_uuid(), v_exercise_id, 'cpp',
                E'#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // TODO: doc n phan tu va xu ly theo de bai\n    return 0;\n}',
                NOW(), false
            );

            INSERT INTO "ExerciseDefaultCodes" ("Id","ExerciseId","Language","StarterCode","CreationTime","IsDeleted")
            VALUES (
                gen_random_uuid(), v_exercise_id, 'java',
                E'import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // TODO: xu ly theo de bai\n    }\n}',
                NOW(), false
            );

            INSERT INTO "ExerciseDefaultCodes" ("Id","ExerciseId","Language","StarterCode","CreationTime","IsDeleted")
            VALUES (
                gen_random_uuid(), v_exercise_id, 'python',
                E'n = int(input())\n# TODO: doc n phan tu va xu ly theo de bai\n',
                NOW(), false
            );
        END LOOP;
    END LOOP;
END $$;

-- =============================================================================
-- BƯỚC 7: Seed 10 CONTESTS
-- =============================================================================
DO $$
DECLARE
    v_existing INT;
    v_creator_id UUID := current_setting('app.creator_id')::uuid;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    SELECT COUNT(*) INTO v_existing FROM "Contests";
    IF v_existing >= 10 THEN
        RAISE NOTICE '✓ Contests: da co %, bo qua.', v_existing;
        RETURN;
    END IF;

    RAISE NOTICE '→ Seeding 10 Contests...';

    INSERT INTO "Contests" ("Id","Title","Description","Status","StartTime","EndTime","DurationInMinutes","AllowedLanguages","MemoryLimit","TimeLimit","AntiCheatLevel","CreatorId","MaxViolations","CreationTime","IsDeleted") VALUES
    (gen_random_uuid(), 'Weekly Contest #1 - Warm Up',
        'Cuoc thi khoi dong tuan, danh cho nguoi moi. 5 bai de + 3 bai trung binh, thoi gian 90 phut.',
        1, v_now + INTERVAL '3 days', v_now + INTERVAL '3 days 90 minutes', 90,
        'cpp,java,python', 256, 1000, 1, v_creator_id, 5, v_now, false),

    (gen_random_uuid(), 'Algorithm Marathon #2',
        'Cuoc thi thuat toan thang, 8 bai trung binh + 4 bai kho. Yeu cau tu duy sau.',
        1, v_now + INTERVAL '7 days', v_now + INTERVAL '7 days 3 hours', 180,
        'cpp,java,python,cs', 512, 2000, 2, v_creator_id, 3, v_now, false),

    (gen_random_uuid(), 'Spring Coding Festival 2026',
        'Le hoi lap trinh mua xuan - giai thuong hap dan cho top 10. Anti-cheat nghiem ngat.',
        1, v_now + INTERVAL '14 days', v_now + INTERVAL '14 days 4 hours', 240,
        'cpp,java,python', 1024, 2000, 2, v_creator_id, 2, v_now, false),

    (gen_random_uuid(), 'Live Battle #12 - DP Special',
        'Cuoc thi truc tiep chuyen de Quy hoach dong, dang dien ra!',
        2, v_now - INTERVAL '30 minutes', v_now + INTERVAL '90 minutes', 120,
        'cpp,java,python', 256, 1000, 1, v_creator_id, 5, v_now, false),

    (gen_random_uuid(), 'Graph Theory Challenge',
        'Cuoc thi dang dien ra chuyen ve Ly thuyet do thi - BFS, DFS, Dijkstra, MST.',
        2, v_now - INTERVAL '1 hour', v_now + INTERVAL '2 hours', 180,
        'cpp,java,python', 512, 1500, 2, v_creator_id, 3, v_now, false),

    (gen_random_uuid(), 'Newbie Cup 2026',
        'Giai dau cho nguoi moi bat dau - chi co bai de va trung binh.',
        3, v_now - INTERVAL '30 days', v_now - INTERVAL '30 days 2 hours', 120,
        'cpp,java,python', 256, 1000, 0, v_creator_id, 10, v_now, false),

    (gen_random_uuid(), 'String Master Contest',
        'Cuoc thi chuyen de xu ly xau - KMP, Z-algorithm, hashing.',
        3, v_now - INTERVAL '15 days', v_now - INTERVAL '15 days 3 hours', 180,
        'cpp,java,python', 256, 1000, 1, v_creator_id, 5, v_now, false),

    (gen_random_uuid(), 'Math Olympiad Round 1',
        'Vong 1 Olympic Toan - Tin, danh cho hoc sinh gioi.',
        3, v_now - INTERVAL '60 days', v_now - INTERVAL '60 days 4 hours', 240,
        'cpp,java,python', 512, 2000, 2, v_creator_id, 3, v_now, false),

    (gen_random_uuid(), 'Sorting & Searching Battle',
        'Cuoc thi da ket thuc ve thuat toan sap xep va tim kiem.',
        3, v_now - INTERVAL '7 days', v_now - INTERVAL '7 days 2 hours', 120,
        'cpp,java,python', 256, 1000, 1, v_creator_id, 5, v_now, false),

    (gen_random_uuid(), 'Greedy & Constructive Cup',
        'Cuoc thi sap toi chuyen ve tham lam va thuat toan xay dung.',
        0, NULL, NULL, 150,
        'cpp,java,python', 256, 1000, 1, v_creator_id, 5, v_now, false);
END $$;

-- =============================================================================
-- BƯỚC 8: Liên kết ContestExercises (10 bài ngẫu nhiên / contest, trừ Draft)
-- =============================================================================
DO $$
DECLARE
    v_existing INT;
    v_contest RECORD;
    v_exercise_ids UUID[];
    v_idx INT;
    v_weight INT;
    v_target INT := 10;
BEGIN
    SELECT COUNT(*) INTO v_existing FROM "ContestExercises";
    IF v_existing > 0 THEN
        RAISE NOTICE '✓ ContestExercises: da co %, bo qua.', v_existing;
        RETURN;
    END IF;

    RAISE NOTICE '→ Linking ContestExercises (~10 bai / contest)...';

    -- Lấy danh sách contest KHÔNG phải Draft
    FOR v_contest IN
        SELECT "Id", "Title" FROM "Contests" WHERE "Status" != 0
    LOOP
        -- Lấy ngẫu nhiên 10 bài (random hạt giống cố định để idempotent)
        SELECT array_agg(x) INTO v_exercise_ids
        FROM (
            SELECT "Id" AS x
            FROM "Exercises"
            -- Random theo Id hash để idempotent
            ORDER BY md5("Id"::text || v_contest."Id"::text)
            LIMIT v_target
        ) sub;

        FOR v_idx IN 1..array_length(v_exercise_ids, 1) LOOP
            v_weight := GREATEST(100, 1000 - (v_idx - 1) * 100);
            INSERT INTO "ContestExercises" ("Id","ContestId","ExerciseId","ScoreWeight","Order","CreationTime","IsDeleted")
            VALUES (gen_random_uuid(), v_contest."Id", v_exercise_ids[v_idx], v_weight, v_idx, NOW(), false);
        END LOOP;
    END LOOP;
END $$;

COMMIT;

-- =============================================================================
-- VERIFY
-- =============================================================================
SELECT 'AspNetRoles'              AS table_name, COUNT(*)::text AS total FROM "AspNetRoles"
UNION ALL SELECT 'AspNetUsers',              COUNT(*)::text FROM "AspNetUsers"
UNION ALL SELECT 'AspNetUserRoles',          COUNT(*)::text FROM "AspNetUserRoles"
UNION ALL SELECT 'Categories',               COUNT(*)::text FROM "Categories"
UNION ALL SELECT 'Exercises',                COUNT(*)::text FROM "Exercises"
UNION ALL SELECT 'ExerciseExamples',         COUNT(*)::text FROM "ExerciseExamples"
UNION ALL SELECT 'ExerciseTestCases',        COUNT(*)::text FROM "ExerciseTestCases"
UNION ALL SELECT 'ExerciseDefaultCodes',     COUNT(*)::text FROM "ExerciseDefaultCodes"
UNION ALL SELECT 'Contests',                 COUNT(*)::text FROM "Contests"
UNION ALL SELECT 'ContestExercises',         COUNT(*)::text FROM "ContestExercises"
ORDER BY 1;

-- Phân bố theo Category
SELECT 'Theo Category:' AS info, "Category", COUNT(*) AS so_bai
FROM "Exercises"
GROUP BY "Category"
ORDER BY "Category";

-- Phân bố theo Difficulty
SELECT 'Theo Difficulty:' AS info,
       CASE "Difficulty" WHEN 0 THEN 'Easy' WHEN 1 THEN 'Medium' ELSE 'Hard' END AS do_kho,
       COUNT(*) AS so_bai
FROM "Exercises"
GROUP BY "Difficulty"
ORDER BY "Difficulty";

-- Phân bố theo Status
SELECT 'Contest theo Status:' AS info,
       CASE "Status" WHEN 0 THEN 'Draft' WHEN 1 THEN 'Upcoming' WHEN 2 THEN 'Ongoing' ELSE 'Ended' END AS trang_thai,
       COUNT(*) AS so_cuoc_thi
FROM "Contests"
GROUP BY "Status"
ORDER BY "Status";