# UTF-8 BOM
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8BOM'

Add-Type -AssemblyName Microsoft.Office.Interop.Word

$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc = $word.Documents.Add()
$selection = $word.Selection

function Add-Heading1($text) {
    $selection.Style = $doc.Styles["Heading 1"]
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Heading2($text) {
    $selection.Style = $doc.Styles["Heading 2"]
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Paragraph($text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Code($text) {
    $selection.Font.Name = "Courier New"
    $selection.Font.Size = 10
    $selection.TypeText($text)
    $selection.TypeParagraph()
    $selection.Font.Name = "Calibri"
    $selection.Font.Size = 11
}

function Add-Table($headers, $rows) {
    $table = $selection.Tables.Add($selection.Range, $rows.Count + 1, $headers.Count)
    $table.Style = "Table Grid"
    $i = 1
    foreach ($h in $headers) {
        $table.Cell(1, $i).Range.Text = $h
        $table.Cell(1, $i).Range.Font.Bold = $true
        $i++
    }
    $r = 2
    foreach ($row in $rows) {
        $c = 1
        foreach ($cell in $row) {
            $table.Cell($r, $c).Range.Text = $cell
            $c++
        }
        $r++
    }
    $selection.TypeParagraph()
}

function Add-Image($path) {
    if (Test-Path $path) {
        $selection.InlineShapes.AddPicture($path) | Out-Null
        $selection.TypeParagraph()
    }
}

# Title
$selection.Style = $doc.Styles["Title"]
Add-Paragraph "TAI LIEU DAC TA NGHIEP VU"
Add-Paragraph "He Thong Goi Y Khoa Hoc - Recommendation System"
Add-Paragraph ""

# Section 1
Add-Heading1 "1. GIOI THIEU"
Add-Paragraph "He thong goi y khoa hoc (Recommendation System) la mot phan quan trong cua nen tang CourseMate, giup hoc vien duoc de xuat nhung khoa hoc, cuoc thi va bai tap phu hop dua tren so thich, ki nang va hanh vi hoc tap cua ho."
Add-Paragraph "He thong su dung thuat toan Hybrid Recommendation ket hop 4 thanh phan chinh:"
Add-Paragraph "- Content-Based Filtering: Dua tren noi dung va danh muc khoa hoc"
Add-Paragraph "- Collaborative Filtering: Dua tren hanh vi cua hoc vien tuong tu"
Add-Paragraph "- Weakness Targeting: Nham vao cac diem yeu can cai thien"
Add-Paragraph "- Popularity Score: Dua tren muc do pho bien cua khoa hoc"

# Section 2
Add-Heading1 "2. CAC BANG ENTITY (DATABASE SCHEMA)"

Add-Heading2 "2.1 Bang StudentPreference"
Add-Paragraph "Luu tru so thich ro rang duoc thu thap tu moi hoc vien."
Add-Table @("Ten cot", "Kieu du lieu", "Mo ta") @(
    @("Id", "Guid", "Khoa chinh"),
    @("StudentId", "Guid", "Khoa ngoai den User"),
    @("FavouriteCategories", "string[]", "Danh sach danh muc yeu thich"),
    @("PreferredDifficulty", "enum?", "Do kho ua thich (Easy/Medium/Hard)"),
    @("LearningGoal", "string", "Muc tieu hoc tap"),
    @("MinutesPerDay", "int", "Thoi gian hoc moi ngay"),
    @("SkillLevel", "string", "Trinh do"),
    @("RecommendContests", "bool", "Co goi y cuoc thi"),
    @("RecommendExercises", "bool", "Co goi y bai tap"),
    @("AutoRefresh", "bool", "Tu dong cap nhat goi y")
)

Add-Heading2 "2.2 Bang StudentSkillProfile"
Add-Paragraph "Theo doi hieu suat cua hoc vien theo tung danh muc/do kho."
Add-Table @("Ten cot", "Kieu du lieu", "Mo ta") @(
    @("Id", "Guid", "Khoa chinh"),
    @("StudentId", "Guid", "Khoa ngoai den User"),
    @("Category", "string", "Ten danh muc bai tap"),
    @("Difficulty", "enum", "Do kho (Easy/Medium/Hard)"),
    @("TotalAttempts", "int", "Tong so lan thu"),
    @("PassedAttempts", "int", "So lan dat yeu cau"),
    @("AverageScore", "double", "Diem trung binh"),
    @("MasteryScore", "double", "Diem thanh thao (0-1)"),
    @("IsWeakArea", "bool", "Co phai diem yeu khong"),
    @("LastAttemptedAt", "DateTime", "Thoi gian thu cuoi")
)

Add-Heading2 "2.3 Bang RecommendationAnalytics"
Add-Paragraph "Luu tru ket qua goi y de phan tich va cai thien thuat toan."
Add-Table @("Ten cot", "Kieu du lieu", "Mo ta") @(
    @("Id", "Guid", "Khoa chinh"),
    @("StudentId", "Guid", "Khoa ngoai den User"),
    @("CourseId", "Guid", "Khoa ngoai den Course"),
    @("ContentScore", "double", "Diem content-based"),
    @("CollaborativeScore", "double", "Diem collaborative"),
    @("WeaknessScore", "double", "Diem nham vao diem yeu"),
    @("PopularityScore", "double", "Diem pho bien"),
    @("FinalScore", "double", "Diem tong hop"),
    @("Source", "string", "Nguon goi y"),
    @("Feedback", "string?", "Phan hoi cua user")
)

Add-Heading2 "2.4 Bang RecommendationLog"
Add-Paragraph "Luu snapshot cua ket qua goi y de phan tich va ngan chan tao lai goi y trung lap."
Add-Table @("Ten cot", "Kieu du lieu", "Mo ta") @(
    @("Id", "Guid", "Khoa chinh"),
    @("StudentId", "Guid", "Khoa ngoai den User"),
    @("RecommendationType", "string", "Loai: Course/Contest/Exercise"),
    @("Strategy", "string", "Chien luoc da dung"),
    @("ResultCount", "int", "So luong ket qua"),
    @("Payload", "string", "JSON snapshot"),
    @("TopScore", "double", "Diem cao nhat"),
    @("CreationTime", "DateTime", "Thoi gian tao")
)

# Section 3 - ERD
Add-Heading1 "3. BIEU DO ERD"
Add-Paragraph "Xem file: UC-REC-ERD.svg"
Add-Image "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-ERD.svg"

# Section 4 - Activity
Add-Heading1 "4. BIEU DO HOAT DONG"
Add-Paragraph "Xem file: UC-REC-Activity.svg"
Add-Image "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-Activity.svg"

# Section 5 - Sequence
Add-Heading1 "5. BIEU DO TUAN TU"
Add-Paragraph "Xem file: UC-REC-Sequence.svg"
Add-Image "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-Sequence.svg"

# Section 6 - Formulas
Add-Heading1 "6. CONG THUC TINH DIEM"

Add-Heading2 "6.1 Hybrid Scoring Formula"
Add-Paragraph "FinalScore = w1 x ContentScore + w2 x CollaborativeScore + w3 x WeaknessScore + w4 x PopularityScore"

Add-Heading2 "6.2 Mastery Score Formula"
Add-Paragraph "MasteryScore = 0.7 x (PassedAttempts / TotalAttempts) + 0.3 x (AverageScore / 100)"

# Section 7 - APIs
Add-Heading1 "7. CAC API ENDPOINTS"
Add-Table @("Method", "Endpoint", "Mo ta") @(
    @("GET", "/api/recommendations", "Lay goi y cho hoc vien"),
    @("GET", "/api/recommendations/my-stats", "Lay thong ke goi y"),
    @("POST", "/api/recommendations/{id}/feedback", "Ghi nhan phan hoi"),
    @("PUT", "/api/recommendations/preference", "Cap nhat so thich"),
    @("GET", "/api/recommendations/skill-profile", "Lay profile ki nang"),
    @("GET", "/api/recommendations/weak-areas", "Lay cac diem yeu")
)

# Section 8 - Use Cases
Add-Heading1 "8. CAC USE CASES"

Add-Heading2 "8.1 UC-REC-01: Xem goi y khoa hoc"
Add-Paragraph "Actor: Hoc vien da dang nhap"
Add-Paragraph "Flow:"
Add-Paragraph "1. Hoc vien truy cap trang Goi y"
Add-Paragraph "2. He thong thu thap signals (so thich, profile ki nang)"
Add-Paragraph "3. He thong tinh diem cho tat ca khoa hoc"
Add-Paragraph "4. He thong tra ve danh sach top N khoa hoc"
Add-Paragraph "5. Hoc vien xem danh sach goi y"

Add-Heading2 "8.2 UC-REC-02: Gui phan hoi ve goi y"
Add-Paragraph "Actor: Hoc vien da dang nhap"
Add-Paragraph "Flow:"
Add-Paragraph "1. Hoc vien xem goi y va nhan nut Thumb up/Down"
Add-Paragraph "2. He thong ghi nhan phan hoi vao RecommendationAnalytics"
Add-Paragraph "3. He thong cap nhat FeedbackTime"

Add-Heading2 "8.3 UC-REC-03: Cap nhat so thich"
Add-Paragraph "Actor: Hoc vien da dang nhap"
Add-Paragraph "Flow:"
Add-Paragraph "1. Hoc vien truy cap trang Cai dat/So thich"
Add-Paragraph "2. Hoc vien chon danh muc yeu thich, do kho, muc tieu"
Add-Paragraph "3. He thong luu vao StudentPreference"
Add-Paragraph "4. He thong su dung so thich moi cho cac lan goi y tiep theo"

# Section 9 - Migration
Add-Heading1 "9. HUONG DAN MIGRATION DATABASE"
Add-Paragraph "De tao cac bang trong database, chay cac lenh sau:"
Add-Code "cd D:\project\CourseMate\CourseMate.Persistent"
Add-Code "dotnet ef migrations add AddRecommendationEntities --project . --startup-project ../CourseMate.API"
Add-Code "dotnet ef database update --project . --startup-project ../CourseMate.API"

# Section 10 - Files
Add-Heading1 "10. HE THONG TEP TINH"
Add-Table @("Tep tin", "Mo ta") @(
    @("UC-REC-ERD.svg", "Bieu do ERD"),
    @("UC-REC-Activity.svg", "Bieu do Hoat dong"),
    @("UC-REC-Sequence.svg", "Bieu do Tuan tu"),
    @("TaiLieu_NghiepVu_Recommendation_CourseMate.md", "Tai lieu Markdown")
)

# Save
$savePath = "D:\project\CourseMate\TaiLieu_NghiepVu_Recommendation_CourseMate.docx"
$doc.SaveAs([ref]$savePath, [ref]16)
$doc.Close()
$word.Quit()

Write-Host "Document saved: $savePath"
