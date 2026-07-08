const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:123456@localhost:5432/CourseMateV2'
  });
  await client.connect();

  const queries = [
    ['AspNetRoles',              'SELECT COUNT(*) FROM "AspNetRoles"'],
    ['AspNetUsers',              'SELECT COUNT(*) FROM "AspNetUsers"'],
    ['AspNetUserRoles',          'SELECT COUNT(*) FROM "AspNetUserRoles"'],
    ['Categories',               'SELECT COUNT(*) FROM "Categories"'],
    ['Exercises',                'SELECT COUNT(*) FROM "Exercises"'],
    ['ExerciseExamples',         'SELECT COUNT(*) FROM "ExerciseExamples"'],
    ['ExerciseTestCases',        'SELECT COUNT(*) FROM "ExerciseTestCases"'],
    ['ExerciseDefaultCodes',     'SELECT COUNT(*) FROM "ExerciseDefaultCodes"'],
    ['Contests',                 'SELECT COUNT(*) FROM "Contests"'],
    ['ContestExercises',         'SELECT COUNT(*) FROM "ContestExercises"'],
  ];

  console.log('\n=== TONG QUAN ===');
  for (const [name, q] of queries) {
    const r = await client.query(q);
    console.log(`  ${name.padEnd(25)}: ${r.rows[0].count}`);
  }

  console.log('\n=== USERS & ROLES ===');
  const users = await client.query(`
    SELECT u."UserName" AS username, r."Name" AS role
    FROM "AspNetUsers" u
    LEFT JOIN "AspNetUserRoles" ur ON ur."UserId" = u."Id"
    LEFT JOIN "AspNetRoles" r ON r."Id" = ur."RoleId"
    ORDER BY u."UserName"
  `);
  for (const row of users.rows) {
    const u = row.username ?? row.UserName ?? '???';
    const r = row.role ?? row.Role ?? '(no role)';
    console.log(`  ${String(u).padEnd(15)} → ${r}`);
  }

  console.log('\n=== EXERCISES BY CATEGORY ===');
  const byCat = await client.query(`
    SELECT "Category", COUNT(*) AS count
    FROM "Exercises"
    GROUP BY "Category" ORDER BY "Category"
  `);
  for (const row of byCat.rows) {
    console.log(`  ${row.Category.padEnd(12)}: ${row.count} bài`);
  }

  console.log('\n=== EXERCISES BY DIFFICULTY ===');
  const byDiff = await client.query(`
    SELECT
      CASE "Difficulty" WHEN 0 THEN 'Easy' WHEN 1 THEN 'Medium' ELSE 'Hard' END AS do_kho,
      COUNT(*) AS count
    FROM "Exercises"
    GROUP BY "Difficulty" ORDER BY "Difficulty"
  `);
  for (const row of byDiff.rows) {
    console.log(`  ${row.do_kho.padEnd(8)}: ${row.count} bài`);
  }

  console.log('\n=== CONTESTS BY STATUS ===');
  const contests = await client.query(`
    SELECT
      "Title",
      CASE "Status" WHEN 0 THEN 'Draft' WHEN 1 THEN 'Upcoming' WHEN 2 THEN 'Ongoing' ELSE 'Ended' END AS status,
      "DurationInMinutes" || 'min' AS duration,
      "AntiCheatLevel" AS anti_cheat
    FROM "Contests"
    ORDER BY "Status", "CreationTime" DESC
  `);
  for (const row of contests.rows) {
    console.log(`  [${row.status.padEnd(8)}] ${row.duration.padEnd(7)} ${row.title}`);
  }

  console.log('\n=== CONTEST-EXERCISE LINKS ===');
  const links = await client.query(`
    SELECT c."Title", COUNT(ce."Id") AS so_bai
    FROM "Contests" c
    LEFT JOIN "ContestExercises" ce ON ce."ContestId" = c."Id"
    WHERE c."Status" != 0
    GROUP BY c."Id", c."Title"
    ORDER BY c."Title"
  `);
  for (const row of links.rows) {
    console.log(`  ${row.title.padEnd(35)}: ${row.so_bai} bài`);
  }

  await client.end();
})().catch(e => { console.error(e.message); process.exit(1); });