# Inspect DB schema to understand tables before inserting seed data
$ErrorActionPreference = "Stop"

Add-Type -Path "D:\project\CourseMate\CourseMate.API\bin\Debug\net10.0\Npgsql.dll"

$cs = "Host=localhost;Port=5432;Database=coursemate;Username=postgres;Password=p@ssW0rd#6062!"
$conn = New-Object Npgsql.NpgsqlConnection($cs)
$conn.Open()

function Exec-Query($sql) {
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    $reader = $cmd.ExecuteReader()
    $rows = @()
    while ($reader.Read()) {
        $obj = [ordered]@{}
        for ($i = 0; $i -lt $reader.FieldCount; $i++) {
            $obj[$reader.GetName($i)] = if ($reader.IsDBNull($i)) { $null } else { $reader.GetValue($i) }
        }
        $rows += [pscustomobject]$obj
    }
    $reader.Close()
    return ,$rows
}

Write-Host "=== ALL TABLES ===" -ForegroundColor Cyan
$tables = Exec-Query "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
$tables | ForEach-Object { $_.table_name }

Write-Host "`n=== EXERCISES STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='exercises' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== CONTESTS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='contests' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== CONTEST_EXERCISES STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='contest_exercises' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== CONTEST_REGISTRATIONS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='contest_registrations' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== COURSES STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='courses' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== CHAPTERS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='chapters' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== LESSONS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='lessons' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== ENROLLMENTS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='enrollments' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== USER_RECOMMENDATIONS STRUCTURE ===" -ForegroundColor Cyan
$cols = Exec-Query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='user_recommendations' ORDER BY ordinal_position"
$cols | Format-Table -AutoSize

Write-Host "`n=== USERS ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT id, email, full_name, role FROM users LIMIT 10"
$rows | Format-Table -AutoSize

Write-Host "`n=== CATEGORIES ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT * FROM categories LIMIT 20"
$rows | Format-Table -AutoSize

Write-Host "`n=== COURSES ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT id, title, category_id, instructor_id, price, level FROM courses LIMIT 15"
$rows | Format-Table -AutoSize

Write-Host "`n=== CHAPTERS ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT id, title, course_id, order_index FROM chapters LIMIT 15"
$rows | Format-Table -AutoSize

Write-Host "`n=== LESSONS ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT id, title, chapter_id, type, order_index FROM lessons LIMIT 15"
$rows | Format-Table -AutoSize

Write-Host "`n=== EXERCISES ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT * FROM exercises LIMIT 5"
$rows | Format-Table -AutoSize

Write-Host "`n=== ENROLLMENTS COUNT ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT COUNT(*) AS cnt FROM enrollments"
$rows | Format-Table -AutoSize

Write-Host "`n=== USER_RECOMMENDATIONS COUNT ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT COUNT(*) AS cnt FROM user_recommendations"
$rows | Format-Table -AutoSize

Write-Host "`n=== CONTESTS COUNT ===" -ForegroundColor Cyan
$rows = Exec-Query "SELECT COUNT(*) AS cnt FROM contests"
$rows | Format-Table -AutoSize

$conn.Close()
