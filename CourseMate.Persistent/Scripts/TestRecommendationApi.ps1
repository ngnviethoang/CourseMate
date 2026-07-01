# Test Recommendation API
# ============================================

$apiBase = "https://localhost:7071/api"

# Student1 token (from your curl command)
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3R1ZGVudDEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjAxOWRkZDhjLWY2NWEtN2FkMi1hNGZhLTFhNmYwMGQwZDFjYiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN0dWRlbnQxQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3R1ZGVudCIsImV4cCI6MTc4MzAwMjc2NiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.HVFIejkuMhxS5N9BP25Nd6I2LEdRR-_qTgG_fhusFcE"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing Recommendation API" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get Recommendations
Write-Host "1. GET /recommendations?topN=10" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$apiBase/recommendations?topN=10" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
} -SkipCertificateCheck

Write-Host "   Courses recommended: $($response.courses.Count)" -ForegroundColor Green
Write-Host "   Contests recommended: $($response.contests.Count)" -ForegroundColor Green
Write-Host "   Exercises recommended: $($response.exercises.Count)" -ForegroundColor Green
Write-Host ""

# Test 2: Get Student Stats
Write-Host "2. GET /recommendations/my-stats" -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "$apiBase/recommendations/my-stats" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
} -SkipCertificateCheck

Write-Host "   Total recommendations: $($stats.totalRecommendations)" -ForegroundColor Green
Write-Host "   Total enrollments: $($stats.totalEnrollments)" -ForegroundColor Green
Write-Host ""

# Test 3: Get Skill Profile
Write-Host "3. GET /recommendations/skill-profile" -ForegroundColor Yellow
$skills = Invoke-RestMethod -Uri "$apiBase/recommendations/skill-profile" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
} -SkipCertificateCheck

Write-Host "   Skill profiles: $($skills.Count)" -ForegroundColor Green
foreach ($skill in $skills) {
    Write-Host "   - $($skill.category) (Difficulty $($skill.difficulty)): Mastery=$($skill.masteryScore)" -ForegroundColor Gray
}
Write-Host ""

# Test 4: Get Preferences
Write-Host "4. GET /recommendations/preferences" -ForegroundColor Yellow
$prefs = Invoke-RestMethod -Uri "$apiBase/recommendations/preferences" -Method Get -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
} -SkipCertificateCheck

Write-Host "   Learning Goal: $($prefs.learningGoal)" -ForegroundColor Green
Write-Host "   Favourite Categories: $($prefs.favouriteCategories -join ', ')" -ForegroundColor Green
Write-Host ""

Write-Host "============================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
