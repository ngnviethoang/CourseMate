# Run Recommendation Tables SQL Script
# ============================================

$ErrorActionPreference = "Stop"

$scriptPath = "D:\project\CourseMate\CourseMate.Persistent\Scripts\CreateRecommendationTables.sql"

# Database connection info (from appsettings.json)
$server = "localhost"
$port = "5432"
$database = "CourseMateV2"
$user = "postgres"
$password = "123456"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Running SQL Script for Recommendation Tables" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    # Try other common paths
    $possiblePaths = @(
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe",
        "C:\Program Files (x86)\PostgreSQL\*\bin\psql.exe"
    )
    foreach ($path in $possiblePaths) {
        $found = Get-ChildItem $path -ErrorAction SilentlyContinue | Sort-Object -Descending | Select-Object -First 1
        if ($found) {
            $psqlPath = $found.FullName
            break
        }
    }
}

if (-not (Test-Path $psqlPath)) {
    Write-Host "ERROR: psql.exe not found. Please install PostgreSQL or add it to PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: You can run the SQL script manually using pgAdmin or DBeaver." -ForegroundColor Yellow
    Write-Host "Script location: $scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using psql from: $psqlPath" -ForegroundColor Green
Write-Host ""

# Run the SQL script
$env:PGPASSWORD = $password
$command = "& `"$psqlPath`" -h $server -p $port -U $user -d $database -f `"$scriptPath`" 2>&1"

Write-Host "Executing SQL..." -ForegroundColor Yellow
$result = Invoke-Expression $command

Write-Host $result

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "SUCCESS: Recommendation tables created!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "ERROR: Failed to create tables. Exit code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
}
