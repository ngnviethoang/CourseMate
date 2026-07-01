$ErrorActionPreference = "Stop"

# Install required packages if not present
$wordInstalled = Get-Package -Name "Word" -ErrorAction SilentlyContinue
if (-not $wordInstalled) {
    Write-Host "Installing Word COM object..."
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = $wdAlertsNone = -1

$doc = $word.Documents.Add()
$selection = $word.Selection

# ================== HELPER FUNCTIONS ==================
function Insert-Heading($text, $level) {
    $selection.Style = $doc.Styles["Heading $level"]
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Insert-Paragraph($text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Insert-Code($code) {
    $selection.Font.Name = "Courier New"
    $selection.Font.Size = 9
    $selection.TypeText($code)
    $selection.TypeParagraph()
    $selection.Font.Name = "Calibri"
    $selection.Font.Size = 11
}

function Insert-Image($path) {
    if (Test-Path $path) {
        $selection.InlineShapes.AddPicture($path)
        $selection.TypeParagraph()
    } else {
        Write-Host "Image not found: $path"
    }
}

function Insert-Table($headers, $rows) {
    $table = $selection.Tables.Add($selection.Range, $rows.Count + 1, $headers.Count)
    $table.Style = "Table Grid"

    # Header row
    $i = 1
    foreach ($header in $headers) {
        $table.Cell(1, $i).Range.Text = $header
        $table.Cell(1, $i).Range.Font.Bold = $true
        $i++
    }

    # Data rows
    $rowIndex = 2
    foreach ($row in $rows) {
        $colIndex = 1
        foreach ($cell in $row) {
            $table.Cell($rowIndex, $colIndex).Range.Text = $cell
            $colIndex++
        }
        $rowIndex++
    }
    $selection.TypeParagraph()
}

# ================== DOCUMENT CONTENT ==================

# Title
$selection.Style = $doc.Styles["Title"]
$selection.TypeText("TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ")
$selection.TypeParagraph()
$selection.TypeText("Hệ thống Gợi Ý Khóa học - Recommendation System")
$selection.TypeParagraph()
$selection.TypeParagraph()

# ================== 1. GIỚI THIỆU ==================
Insert-Heading "1. Giới thiệu" 1
Insert-Paragraph "Hệ thống gợi ý khóa học (Recommendation System) là một phần quan trọng của nền tảng CourseMate, giúp học viên được đề xuất những khóa học, cuộc thi và bài tập phù hợp dựa trên sở thích, kỹ năng và hành vi học tập của họ."
Insert-Paragraph "Hệ thống sử dụng thuật toán Hybrid Recommendation kết hợp 4 thành phần chính:"
Insert-Paragraph "• Content-Based Filtering: Dựa trên nội dung và danh mục khóa học"
Insert-Paragraph "• Collaborative Filtering: Dựa trên hành vi của học viên tương tự"
Insert-Paragraph "• Weakness Targeting: Nhắm vào các điểm yếu cần cải thiện"
Insert-Paragraph "• Popularity Score: Dựa trên mức độ phổ biến của khóa học"
Insert-Paragraph ""

# ================== 2. CÁC BẢNG ENTITY ==================
Insert-Heading "2. Các bảng Entity (Database Schema)" 1

# 2.1 StudentPreference
Insert-Heading "2.1 Bảng StudentPreference", 2
Insert-Paragraph "Lưu trữ sở thích rõ ràng được thu thập từ mỗi học viên."
Insert-Table @("Tên cột", "Kiểu dữ liệu", "Mô tả") @(
    @("Id", "Guid", "Khóa chính"),
    @("StudentId", "Guid", "Khóa ngoại đến User"),
    @("FavouriteCategories", "string[]", "Danh sách danh mục yêu thích"),
    @("PreferredDifficulty", "enum?", "Độ khó ưa thích (Easy/Medium/Hard)"),
    @("LearningGoal", "string", "Mục tiêu học tập"),
    @("MinutesPerDay", "int", "Thời gian học mỗi ngày (phút)"),
    @("SkillLevel", "string", "Trình độ (beginner/intermediate/advanced)"),
    @("RecommendContests", "bool", "Có gợi ý cuộc thi không"),
    @("RecommendExercises", "bool", "Có gợi ý bài tập không"),
    @("AutoRefresh", "bool", "Tự động cập nhật gợi ý")
)

# 2.2 StudentSkillProfile
Insert-Heading "2.2 Bảng StudentSkillProfile", 2
Insert-Paragraph "Theo dõi hiệu suất của học viên theo từng danh mục/độ khó để xác định điểm mạnh và điểm yếu."
Insert-Table @("Tên cột", "Kiểu dữ liệu", "Mô tả") @(
    @("Id", "Guid", "Khóa chính"),
    @("StudentId", "Guid", "Khóa ngoại đến User"),
    @("Category", "string", "Tên danh mục bài tập"),
    @("Difficulty", "enum", "Độ khó (Easy/Medium/Hard)"),
    @("TotalAttempts", "int", "Tổng số lần thử"),
    @("PassedAttempts", "int", "Số lần đạt yêu cầu"),
    @("AverageScore", "double", "Điểm trung bình"),
    @("AverageRuntime", "double", "Thời gian chạy trung bình"),
    @("MasteryScore", "double", "Điểm thành thạo (0-1)"),
    @("IsWeakArea", "bool", "Có phải điểm yếu không"),
    @("LastAttemptedAt", "DateTime", "Thời gian thử cuối")
)

# 2.3 RecommendationAnalytics
Insert-Heading "2.3 Bảng RecommendationAnalytics", 2
Insert-Paragraph "Lưu trữ kết quả gợi ý để phân tích và cải thiện thuật toán."
Insert-Table @("Tên cột", "Kiểu dữ liệu", "Mô tả") @(
    @("Id", "Guid", "Khóa chính"),
    @("StudentId", "Guid", "Khóa ngoại đến User"),
    @("CourseId", "Guid", "Khóa ngoại đến Course"),
    @("EnrollmentId", "Guid?", "Khóa ngoại đến Enrollment (nếu đã đăng ký)"),
    @("ContentScore", "double", "Điểm content-based"),
    @("CollaborativeScore", "double", "Điểm collaborative filtering"),
    @("WeaknessScore", "double", "Điểm nhắm vào điểm yếu"),
    @("PopularityScore", "double", "Điểm phổ biến"),
    @("FinalScore", "double", "Điểm tổng hợp"),
    @("Source", "string", "Nguồn gợi ý"),
    @("Feedback", "string?", "Phản hồi của user"),
    @("FeedbackTime", "DateTime?", "Thời gian phản hồi"),
    @("IsCompleted", "bool", "Đã hoàn thành khóa học chưa"),
    @("CompletedAt", "DateTime?", "Thời gian hoàn thành")
)

# 2.4 RecommendationLog
Insert-Heading "2.4 Bảng RecommendationLog", 2
Insert-Paragraph "Lưu snapshot của kết quả gợi ý để phân tích và ngăn chặn tạo lại gợi ý trùng lặp."
Insert-Table @("Tên cột", "Kiểu dữ liệu", "Mô tả") @(
    @("Id", "Guid", "Khóa chính"),
    @("StudentId", "Guid", "Khóa ngoại đến User"),
    @("RecommendationType", "string", "Loại: Course/Contest/Exercise"),
    @("Strategy", "string", "Chiến lược đã dùng"),
    @("ResultCount", "int", "Số lượng kết quả"),
    @("Payload", "string", "JSON snapshot của kết quả"),
    @("TopScore", "double", "Điểm cao nhất trong batch"),
    @("CreationTime", "DateTime", "Thời gian tạo")
)

# ================== 3. BIỂU ĐỒ ERD ==================
Insert-Heading "3. Biểu đồ ERD (Entity Relationship Diagram)" 1
Insert-Paragraph "Sơ đồ dưới đây thể hiện mối quan hệ giữa các bảng trong hệ thống gợi ý:"
Insert-Paragraph ""

$erdPath = "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-ERD.svg"
if (Test-Path $erdPath) {
    Insert-Image $erdPath
}

# ================== 4. BIỂU ĐỒ HOẠT ĐỘNG ==================
Insert-Heading "4. Biểu đồ Hoạt động (Activity Diagram)" 1
Insert-Paragraph "Biểu đồ hoạt động mô tả luồng xử lý của hệ thống gợi ý từ khi user yêu cầu đến khi nhận được kết quả."
Insert-Paragraph ""

$activityPath = "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-Activity.svg"
if (Test-Path $activityPath) {
    Insert-Image $activityPath
}

# ================== 5. BIỂU ĐỒ TUẦN TỰ ==================
Insert-Heading "5. Biểu đồ Tuần tự (Sequence Diagram)" 1
Insert-Paragraph "Biểu đồ tuần tự mô tả các tương tác giữa các thành phần trong hệ thống khi thực hiện chức năng gợi ý."
Insert-Paragraph ""

$sequencePath = "D:\project\CourseMate\sequence_diagrams_svg\UC-REC-Sequence.svg"
if (Test-Path $sequencePath) {
    Insert-Image $sequencePath
}

# ================== 6. CÔNG THỨC TÍNH ĐIỂM ==================
Insert-Heading "6. Công thức tính điểm gợi ý" 1
Insert-Paragraph "Hệ thống sử dụng công thức Hybrid Scoring:"
Insert-Paragraph ""
Insert-Code "FinalScore = w1 × ContentScore + w2 × CollaborativeScore + w3 × WeaknessScore + w4 × PopularityScore"
Insert-Paragraph "Trong đó:"
Insert-Paragraph "• ContentScore: Điểm dựa trên sự phù hợp của danh mục và mô tả khóa học với sở thích học viên"
Insert-Paragraph "• CollaborativeScore: Điểm dựa trên các khóa học mà học viên có hành vi tương tự đã đăng ký"
Insert-Paragraph "• WeaknessScore: Điểm cao hơn nếu khóa học giúp cải thiện điểm yếu của học viên"
Insert-Paragraph "• PopularityScore: Điểm dựa trên số lượng học viên đã đăng ký và đánh giá"
Insert-Paragraph ""
Insert-Paragraph "MasteryScore cho StudentSkillProfile:"
Insert-Paragraph ""
Insert-Code "MasteryScore = 0.7 × (PassedAttempts / TotalAttempts) + 0.3 × (AverageScore / 100)"
Insert-Paragraph "Điểm này xác định mức độ thành thạo của học viên trong một danh mục/độ khó cụ thể."

# ================== 7. API ENDPOINTS ==================
Insert-Heading "7. Các API Endpoints" 1
Insert-Table @("Method", "Endpoint", "Mô tả") @(
    @("GET", "/api/recommendations", "Lấy gợi ý cho học viên hiện tại"),
    @("GET", "/api/recommendations/my-stats", "Lấy thống kê gợi ý của học viên"),
    @("GET", "/api/recommendations/my-analytics", "Lấy lịch sử gợi ý của học viên"),
    @("POST", "/api/recommendations/{id}/feedback", "Ghi nhận phản hồi về gợi ý"),
    @("PUT", "/api/recommendations/preference", "Cập nhật sở thích học viên"),
    @("GET", "/api/recommendations/preference", "Lấy sở thích học viên"),
    @("GET", "/api/recommendations/skill-profile", "Lấy profile kỹ năng"),
    @("GET", "/api/recommendations/weak-areas", "Lấy các điểm yếu cần cải thiện"),
    @("POST", "/api/recommendations/rebuild-skill-profile", "Xây dựng lại profile kỹ năng")
)

# ================== 8. DTOs ==================
Insert-Heading "8. Data Transfer Objects (DTOs)" 1

Insert-Heading "8.1 RecommendationResponseDto", 2
Insert-Table @("Thuộc tính", "Kiểu", "Mô tả") @(
    @("StudentId", "Guid", "ID học viên"),
    @("Courses", "List<RecommendedCourseDto>", "Danh sách khóa học gợi ý"),
    @("Contests", "List<RecommendedContestDto>", "Danh sách cuộc thi gợi ý"),
    @("Exercises", "List<RecommendedExerciseDto>", "Danh sách bài tập gợi ý"),
    @("WeakAreas", "List<string>", "Các danh mục điểm yếu"),
    @("StrongAreas", "List<string>", "Các danh mục điểm mạnh"),
    @("Strategy", "string", "Chiến lược được sử dụng"),
    @("GeneratedAt", "DateTime", "Thời gian tạo gợi ý")
)

Insert-Heading "8.2 RecommendedCourseDto", 2
Insert-Table @("Thuộc tính", "Kiểu", "Mô tả") @(
    @("CourseId", "Guid", "ID khóa học"),
    @("AnalyticsId", "Guid", "ID bản ghi analytics"),
    @("Title", "string", "Tiêu đề khóa học"),
    @("Description", "string", "Mô tả khóa học"),
    @("ImageUrl", "string", "URL hình ảnh"),
    @("Price", "decimal", "Giá khóa học"),
    @("CategoryName", "string", "Tên danh mục"),
    @("InstructorName", "string", "Tên giảng viên"),
    @("AverageRating", "double", "Điểm đánh giá trung bình"),
    @("EnrollmentCount", "int", "Số lượng học viên"),
    @("Score", "double", "Điểm gợi ý"),
    @("Reasons", "List<RecommendationReason>", "Danh sách lý do gợi ý"),
    @("Explanation", "string", "Giải thích vì sao được gợi ý")
)

# ================== 9. USE CASES ==================
Insert-Heading "9. Các Use Cases" 1

Insert-Heading "9.1 UC-REC-01: Xem gợi ý khóa học", 2
Insert-Paragraph "Actor: Học viên đã đăng nhập"
Insert-Paragraph "Pre-condition: Học viên có tài khoản và đã đăng nhập"
Insert-Paragraph "Flow:"
Insert-Paragraph "1. Học viên truy cập trang Gợi ý"
Insert-Paragraph "2. Hệ thống thu thập signals (sở thích, profile kỹ năng)"
Insert-Paragraph "3. Hệ thống tính điểm cho tất cả khóa học"
Insert-Paragraph "4. Hệ thống trả về danh sách top N khóa học có điểm cao nhất"
Insert-Paragraph "5. Học viên xem danh sách gợi ý"

Insert-Heading "9.2 UC-REC-02: Gửi phản hồi về gợi ý", 2
Insert-Paragraph "Actor: Học viên đã đăng nhập"
Insert-Paragraph "Flow:"
Insert-Paragraph "1. Học viên xem gợi ý và nhấn nút Thumb up/Down"
Insert-Paragraph "2. Hệ thống ghi nhận phản hồi vào RecommendationAnalytics"
Insert-Paragraph "3. Hệ thống cập nhật FeedbackTime"

Insert-Heading "9.3 UC-REC-03: Cập nhật sở thích", 2
Insert-Paragraph "Actor: Học viên đã đăng nhập"
Insert-Paragraph "Flow:"
Insert-Paragraph "1. Học viên truy cập trang Cài đặt/Sở thích"
Insert-Paragraph "2. Học viên chọn danh mục yêu thích, độ khó, mục tiêu học tập"
Insert-Paragraph "3. Hệ thống lưu vào StudentPreference"
Insert-Paragraph "4. Hệ thống sử dụng sở thích mới cho các lần gợi ý tiếp theo"

# ================== 10. MIGRATION ==================
Insert-Heading "10. Hướng dẫn Migration Database" 1
Insert-Paragraph "Để tạo các bảng trong database, chạy các lệnh sau:"
Insert-Paragraph ""
Insert-Heading "10.1 Build Project", 2
Insert-Code "cd D:\project\CourseMate\CourseMate.Persistent"
Insert-Code "dotnet build"
Insert-Paragraph ""

Insert-Heading "10.2 Create Migration", 2
Insert-Code "dotnet ef migrations add AddRecommendationEntities --project . --startup-project ../CourseMate.API"
Insert-Paragraph ""

Insert-Heading "10.3 Apply Migration", 2
Insert-Code "dotnet ef database update --project . --startup-project ../CourseMate.API"
Insert-Paragraph ""

Insert-Heading "10.4 Seed Data (Optional)", 2
Insert-Paragraph "Để seed dữ liệu test, thêm vào DbContext Seed method hoặc chạy script SQL trong thư mục Scripts/"

# ================== SAVE DOCUMENT ==================
$savePath = "D:\project\CourseMate\TaiLieu_NghiepVu_Recommendation_CourseMate.docx"
$doc.SaveAs([ref]$savePath, [ref]16)  # 16 = wdFormatXMLDocument (docx)
$doc.Close()
$word.Quit()

Write-Host "Document saved to: $savePath"
Write-Host "Done!"
