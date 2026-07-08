const { Client } = require('pg');
const fs = require('fs');

(async () => {
  const conn = process.env.COURSEMATE_PG
    || 'postgresql://postgres:123456@localhost:5432/CourseMateV2';

  console.log('Connecting:', conn.replace(/:[^:@]*@/, ':***@'));
  const client = new Client({ connectionString: conn });
  await client.connect();

  const sql = fs.readFileSync('d:/project/CourseMate/seed_exercises_contests.sql', 'utf8');
  console.log('SQL size:', sql.length, 'bytes');

  try {
    await client.query(sql);
    console.log('✓ Script executed successfully.');
  } catch (e) {
    console.error('✗ Error:', e.message);
    console.error('Position:', e.position || 'n/a');
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();