# PHÂN TÍCH NGHIỆP VỤ VÀ THIẾT KẾ USE CASE
## Hệ thống Recommendation - Khóa học lập trình CourseMate

---

## 1. TỔNG QUAN HỆ THỐNG RECOMMENDATION

### 1.1 Mục tiêu
Hệ thống gợi ý khóa học hybrid kết hợp nhiều chiến lược:
- **Content-based Filtering**: Dựa trên sở thích người dùng (danh mục yêu thích, mục tiêu học tập)
- **Collaborative Filtering**: Dựa trên hành vi của học viên tương đồng
- **Weakness-based**: Nhắm vào điểm yếu của học viên để cải thiện
- **Popularity-based**: Dựa trên độ phổ biến (rating, số lượng đăng ký)

### 1.2 Kiến trúc Hybrid Scoring
```
FinalScore = ContentScore × 0.35 + CollaborativeScore × 0.25 + WeaknessScore × 0.30 + PopularityScore × 0.10
```

---

## 2. CÁC USE CASE CHÍNH

### UC-01: Lấy danh sách gợi ý cá nhân hóa

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-01 |
| **Tên** | Lấy danh sách gợi ý cá nhân hóa |
| **Tác nhân chính** | Học viên (Student) |
| **Tác nhân phụ** | Hệ thống Recommendation Engine |
| **Mô tả ngắn** | Học viên yêu cầu hệ thống gợi ý khóa học, cuộc thi và bài tập phù hợp với profile của mình |
| **Tiền điều kiện** | Học viên đã đăng nhập và có tài khoản trong hệ thống |
| **Hậu điều kiện** | Trả về danh sách gợi ý có xếp hạng theo điểm relevance |
| **Luồng chính** | 1. Học viên gửi yêu cầu GET /api/recommendations<br>2. Hệ thống thu thập signals từ:<br>   - StudentPreference (sở thích rõ ràng)<br>   - StudentSkillProfile (kỹ năng theo category/difficulty)<br>   - Enrollment (khóa học đã đăng ký)<br>   - Submission history (bài nộp bài tập/cuộc thi)<br>3. Hệ thống tính điểm hybrid cho từng khóa học<br>4. Hệ thống sắp xếp và trả về Top N kết quả<br>5. Lưu log để phân tích |
| **Luồng phụ** | **UC-01a**: Nếu học viên chưa có preference → dùng collaborative signals<br>**UC-01b**: Nếu học viên mới (chưa có skill profile) → dùng content-based + popularity |
| **Ngoại lệ** | **EX-01**: Không có khóa học phù hợp → trả về empty list<br>**EX-02**: Lỗi database → trả về 500 Internal Server Error |

---

### UC-02: Xem và cập nhật sở thích cá nhân

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-02 |
| **Tên** | Xem và cập nhật sở thích cá nhân |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Học viên có thể xem và thiết lập các sở thích rõ ràng để cải thiện độ chính xác của gợi ý |
| **Tiền điều kiện** | Học viên đã đăng nhập |
| **Hậu điều kiện** | Preferences được lưu và sẽ ảnh hưởng đến các gợi ý tiếp theo |
| **Luồng chính** | 1. Học viên gửi GET /api/recommendations/preferences<br>2. Hệ thống trả về preferences hiện tại<br>3. Học viên chỉnh sửa và gửi PUT /api/recommendations/preferences<br>4. Hệ thống validate dữ liệu<br>5. Hệ thống upsert vào StudentPreference table |
| **Dữ liệu sở thích** | - FavouriteCategories: Danh mục yêu thích<br>- PreferredDifficulty: Độ khó mong muốn<br>- LearningGoal: Mục tiêu học tập<br>- MinutesPerDay: Thời gian học mỗi ngày<br>- SkillLevel: Trình độ tự đánh giá<br>- RecommendContests: Có gợi ý cuộc thi không<br>- RecommendExercises: Có gợi ý bài tập không |

---

### UC-03: Xem profile kỹ năng

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-03 |
| **Tên** | Xem profile kỹ năng cá nhân |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Học viên xem chi tiết kỹ năng theo từng danh mục và độ khó |
| **Tiền điều kiện** | Học viên đã đăng nhập và có lịch sử làm bài |
| **Hậu điều kiện** | Trả về danh sách skill profile với mastery scores |
| **Luồng chính** | 1. Học viên gửi GET /api/recommendations/skill-profile<br>2. Hệ thống tính MasteryScore từ submission history<br>3. Trả về danh sách sắp xếp theo MasteryScore giảm dần |
| **Công thức MasteryScore** | `MasteryScore = PassRate × 0.7 + ScoreRate × 0.3`<br>Trong đó: ScoreRate = avgScore / 100 |

---

### UC-04: Xem các điểm yếu

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-04 |
| **Tên** | Xem danh sách điểm yếu cần cải thiện |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Hệ thống xác định và hiển thị các lĩnh vực mà học viên còn yếu |
| **Tiền điều kiện** | Học viên có StudentSkillProfile |
| **Hậu điều kiện** | Trả về danh sách weak areas (MasteryScore < 0.5) |
| **Luồng chính** | 1. Học viên gửi GET /api/recommendations/weak-areas<br>2. Hệ thống lọc các profile có IsWeakArea = true<br>3. Trả về sắp xếp theo MasteryScore tăng dần |

---

### UC-05: Rebuild Skill Profile

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-05 |
| **Tên** | Tái tạo profile kỹ năng |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Học viên yêu cầu hệ thống tính lại skill profile từ đầu |
| **Tiền điều kiện** | Học viên đã đăng nhập |
| **Hậu điều kiện** | StudentSkillProfile được cập nhật với dữ liệu mới nhất |
| **Luồng chính** | 1. Học viên gửi POST /api/recommendations/skill-profile/rebuild<br>2. Hệ thống query ExerciseSubmissions và ContestSubmissions<br>3. Tính toán lại từng (Category, Difficulty) bucket<br>4. Xóa profile cũ và insert profile mới<br>5. Trả về số lượng buckets đã update |

---

### UC-06: Gửi phản hồi về gợi ý

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-06 |
| **Tên** | Gửi phản hồi về khóa học được gợi ý |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Học viên đánh giá gợi ý có hữu ích không |
| **Tiền điều kiện** | Học viên nhận được gợi ý có AnalyticsId |
| **Hậu điều kiện** | Feedback được lưu vào RecommendationAnalytics |
| **Luồng chính** | 1. Học viên gửi POST /api/recommendations/{analyticsId}/feedback<br>2. Hệ thống update RecommendationAnalytics<br>3. Nếu Enrolled → cập nhật EnrolledAt<br>4. Trả về success |

---

### UC-07: Xem thống kê cá nhân

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-07 |
| **Tên** | Xem thống kê gợi ý cá nhân |
| **Tác nhân chính** | Học viên (Student) |
| **Mô tả ngắn** | Học viên xem tổng quan về các gợi ý đã nhận và tỷ lệ tương tác |
| **Luồng chính** | 1. Học viên gửi GET /api/recommendations/my-stats<br>2. Hệ thống tính:<br>   - Tổng gợi ý nhận được<br>   - Số khóa học đã đăng ký<br>   - Số khóa học đã hoàn thành<br>   - Engagement Rate<br>   - Completion Rate |

---

### UC-08: Preview gợi ý cho học viên (Admin/Instructor)

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-08 |
| **Tên** | Admin/Instructor xem trước gợi ý |
| **Tác nhân chính** | Admin, Instructor |
| **Mô tả ngắn** | Giảng viên hoặc quản trị viên xem trước gợi ý của một học viên cụ thể |
| **Tiền điều kiện** | User có role Admin hoặc Instructor |
| **Luồng chính** | 1. Admin gửi GET /api/recommendations/preview/{studentId}<br>2. Hệ thống verify role<br>3. Gọi GetRecommendationQuery với studentIdOverride<br>4. Trả về kết quả gợi ý |

---

### UC-09: Xem tổng quan analytics (Admin)

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-09 |
| **Tên** | Xem tổng quan analytics hệ thống |
| **Tác nhân chính** | Admin |
| **Mô tả ngắn** | Admin xem báo cáo tổng quan về hiệu quả hệ thống gợi ý |
| **Luồng chính** | 1. Admin gửi GET /api/recommendations/analytics/summary<br>2. Hệ thống tính các metrics:<br>   - TotalRecommendations<br>   - TotalEnrollments<br>   - Click-Through Rate<br>   - Enrollment Rate<br>   - Helpful Rate<br>   - Top/Worst performing courses |

---

### UC-10: Xem top khóa học hiệu quả (Admin)

| Thuộc tính | Mô tả |
|------------|-------|
| **ID** | UC-10 |
| **Tên** | Xem top khóa học hiệu quả nhất |
| **Tác nhân chính** | Admin, Instructor |
| **Mô tả ngắn** | Xem danh sách khóa học có tỷ lệ enrollment cao nhất từ gợi ý |
| **Luồng chính** | 1. Admin gửi GET /api/recommendations/analytics/top-courses<br>2. Hệ thống tính enrollment rate theo course<br>3. Trả về Top N courses |

---

## 3. BẢNG THUỘC TÍNH CÁC THỰC THỂ LIÊN QUAN

### 3.1 StudentPreference

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|----------------|---------------|-------|-----------|
| 1 | Id | Guid | Khóa chính | PK, NOT NULL |
| 2 | StudentId | Guid | ID của học viên | FK → User.Id, NOT NULL |
| 3 | FavouriteCategories | ICollection<string> | Danh mục yêu thích | NOT NULL, có thể empty |
| 4 | PreferredDifficulty | ExerciseDifficultyType? | Độ khó ưa thích | NULL = không chọn |
| 5 | LearningGoal | string | Mục tiêu học tập | Max 1000 chars |
| 6 | MinutesPerDay | int | Phút học mỗi ngày | >= 0 |
| 7 | SkillLevel | string | Trình độ tự đánh giá | "beginner", "intermediate", "advanced" |
| 8 | RecommendContests | bool | Có gợi ý cuộc thi | DEFAULT true |
| 9 | RecommendExercises | bool | Có gợi ý bài tập | DEFAULT true |
| 10 | AutoRefresh | bool | Tự động refresh profile | DEFAULT true |

---

### 3.2 StudentSkillProfile

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|----------------|---------------|-------|-----------|
| 1 | Id | Guid | Khóa chính | PK, NOT NULL |
| 2 | StudentId | Guid | ID của học viên | FK → User.Id, NOT NULL |
| 3 | Category | string | Tên danh mục | NOT NULL, Max 100 |
| 4 | Difficulty | ExerciseDifficultyType | Độ khó | NOT NULL |
| 5 | TotalAttempts | int | Tổng số lần thử | >= 0 |
| 6 | PassedAttempts | int | Số lần đạt | >= 0, <= TotalAttempts |
| 7 | AverageScore | double | Điểm trung bình | 0-100 |
| 8 | AverageRuntime | double | Thời gian chạy TB (ms) | >= 0 |
| 9 | MasteryScore | double | Điểm thành thạo | 0-1 |
| 10 | IsWeakArea | bool | Có phải điểm yếu | MasteryScore < 0.5 |
| 11 | LastAttemptedAt | DateTimeOffset | Lần thử cuối | NOT NULL |

**Note**: Unique constraint trên (StudentId, Category, Difficulty)

---

### 3.3 RecommendationLog

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|----------------|---------------|-------|-----------|
| 1 | Id | Guid | Khóa chính | PK, NOT NULL |
| 2 | StudentId | Guid | ID của học viên | FK → User.Id, NOT NULL |
| 3 | RecommendationType | string | Loại gợi ý | "Course", "Contest", "Exercise" |
| 4 | Strategy | string | Chiến lược sử dụng | e.g., "hybrid-content-collab-weakness" |
| 5 | ResultCount | int | Số lượng kết quả | >= 0 |
| 6 | Payload | string | JSON snapshot | Max 4000 chars |
| 7 | TopScore | double | Điểm cao nhất | 0-1 |

---

### 3.4 RecommendationAnalytics

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|----------------|---------------|-------|-----------|
| 1 | Id | Guid | Khóa chính | PK, NOT NULL |
| 2 | StudentId | Guid | ID của học viên | FK → User.Id, NOT NULL |
| 3 | CourseId | Guid | ID khóa học được gợi ý | FK → Course.Id, NOT NULL |
| 4 | EnrollmentId | Guid? | ID enrollment (nếu có) | FK → Enrollment.Id, NULL |
| 5 | ContentScore | double | Điểm content-based | 0-1 |
| 6 | CollaborativeScore | double | Điểm collaborative | 0-1 |
| 7 | WeaknessScore | double | Điểm weakness-based | 0-1 |
| 8 | PopularityScore | double | Điểm popularity | 0-1 |
| 9 | FinalScore | double | Điểm tổng hợp | 0-1 |
| 10 | Source | string | Nguồn gợi ý | "HomePage", "CourseDetail", etc. |
| 11 | Feedback | string? | Phản hồi | "Helpful", "NotHelpful", "Enrolled", NULL |
| 12 | FeedbackTime | DateTimeOffset? | Thời gian phản hồi | NULL |
| 13 | EnrolledAt | DateTimeOffset? | Thời gian đăng ký | NULL |
| 14 | IsCompleted | bool | Đã hoàn thành | DEFAULT false |
| 15 | CompletedAt | DateTimeOffset? | Thời gian hoàn thành | NULL |

---

### 3.5 CourseEmbedding

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả | Ràng buộc |
|-----|----------------|---------------|-------|-----------|
| 1 | Id | Guid | Khóa chính | PK, NOT NULL |
| 2 | CourseId | Guid | ID khóa học | FK → Course.Id, UNIQUE |
| 3 | SourceText | string | Text đã embed | Max 8000 chars |
| 4 | Dimensions | int | Số chiều vector | DEFAULT 768 |
| 5 | Embedding | Vector | Vector embedding từ AI | pgvector type |

---

## 4. SƠ ĐỒ USE CASE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ACTOR: Student                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ UC-01: Get    │        │ UC-02: Preference│        │ UC-03: Skill     │
│ Recommendations│◄──────►│                  │        │ Profile          │
└───────────────┘        └──────────────────┘        └──────────────────┘
        │                           │                           │
        │                           ▼                           ▼
        │                ┌──────────────────┐        ┌──────────────────┐
        │                │ UC-04: Weak      │        │ UC-05: Rebuild   │
        │                │ Areas            │        │ Skill Profile    │
        │                └──────────────────┘        └──────────────────┘
        │
        ▼
┌───────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ UC-06: Feedback│        │ UC-07: My Stats │        │                  │
│               │        │                  │        │                  │
└───────────────┘        └──────────────────┘        └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      ACTOR: Admin / Instructor                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐        ┌──────────────────┐        ┌──────────────────┐
│ UC-08: Preview│        │ UC-09: Analytics │        │ UC-10: Top       │
│ Student Rec.  │        │ Summary          │        │ Courses          │
└───────────────┘        └──────────────────┘        └──────────────────┘
```

---

## 5. BẢNG THUỘC TÍNH CÁC BẢNG HỆ THỐNG (Liên quan đến Recommendation)

### 5.1 Course (Khóa học)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | Title | string | Tên khóa học |
| 3 | Description | string | Mô tả |
| 4 | Price | decimal | Giá |
| 5 | ImageUrl | string | URL hình ảnh |
| 6 | IsPublished | bool | Đã publish |
| 7 | CategoryId | Guid | FK → Category |
| 8 | InstructorId | Guid | FK → User (Instructor) |

---

### 5.2 Exercise (Bài tập)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | Title | string | Tên bài tập |
| 3 | Description | string | Mô tả |
| 4 | Difficulty | ExerciseDifficultyType | Độ khó |
| 5 | Category | string | Danh mục |
| 6 | CreatorId | Guid | FK → User |
| 7 | Constraints | ICollection<string> | Ràng buộc |
| 8 | Hints | ICollection<string> | Gợi ý |
| 9 | IsHidden | bool | Ẩn/Hiện |

---

### 5.3 Contest (Cuộc thi)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | Title | string | Tên cuộc thi |
| 3 | Description | string | Mô tả |
| 4 | Status | ContestStatus | Draft/Upcoming/Ongoing/Ended/Cancelled |
| 5 | StartTime | DateTimeOffset? | Thời gian bắt đầu |
| 6 | EndTime | DateTimeOffset? | Thời gian kết thúc |
| 7 | DurationInMinutes | int | Thời lượng (phút) |
| 8 | CreatorId | Guid | FK → User |
| 9 | AntiCheatLevel | AntiCheatLevel | Mức độ chống gian lận |

---

### 5.4 Enrollment (Đăng ký khóa học)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | StudentId | Guid | FK → User |
| 3 | CourseId | Guid | FK → Course |

---

### 5.5 ExerciseSubmission (Bài nộp bài tập)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | ExerciseId | Guid | FK → Exercise |
| 3 | UserId | Guid | FK → User |
| 4 | Language | string | Ngôn ngữ lập trình |
| 5 | Code | string | Code đã nộp |
| 6 | IsPassed | bool | Đạt/Không đạt |
| 7 | Score | double | Điểm |
| 8 | TotalTime | double | Thời gian chạy (ms) |
| 9 | TotalMemory | double | Bộ nhớ sử dụng |

---

### 5.6 ContestSubmission (Bài nộp cuộc thi)

| STT | Tên thuộc tính | Kiểu dữ liệu | Mô tả |
|-----|----------------|---------------|-------|
| 1 | Id | Guid | Khóa chính |
| 2 | ContestId | Guid | FK → Contest |
| 3 | ExerciseId | Guid | FK → Exercise |
| 4 | StudentId | Guid | FK → User |
| 5 | Language | string | Ngôn ngữ |
| 6 | Code | string | Code |
| 7 | Score | int | Điểm |
| 8 | TotalTime | float | Thời gian |
| 9 | TotalMemory | int | Bộ nhớ |
| 10 | IsFinal | bool | Bài nộp cuối cùng |

---

## 6. BẢNG THUỘC TÍNH API ENDPOINTS

### 6.1 Request/Response DTOs

#### GetRecommendationQuery
| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| TopN | int | Số lượng kết quả (default: 10, max: 50) |
| StudentIdOverride | Guid? | Override student ID (cho admin preview) |

#### RecommendationResponseDto
| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| StudentId | Guid | ID học viên |
| Courses | List<RecommendedCourseDto> | Danh sách khóa học gợi ý |
| Contests | List<RecommendedContestDto> | Danh sách cuộc thi gợi ý |
| Exercises | List<RecommendedExerciseDto> | Danh sách bài tập gợi ý |
| WeakAreas | List<string> | Các danh mục yếu |
| StrongAreas | List<string> | Các danh mục mạnh |
| Strategy | string | Chiến lược hybrid đã dùng |
| GeneratedAt | DateTimeOffset | Thời gian tạo |

#### RecommendedCourseDto
| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| CourseId | Guid | ID khóa học |
| AnalyticsId | Guid | ID để gửi feedback |
| Title | string | Tên khóa học |
| Description | string | Mô tả |
| Price | decimal | Giá |
| CategoryName | string | Tên danh mục |
| InstructorName | string | Tên giảng viên |
| Score | double | Điểm relevance (0-1) |
| Reasons | List<RecommendationReason> | Lý do gợi ý |
| Explanation | string | Giải thích tiếng Việt |

---

## 7. CÁC ENUM LIÊN QUAN

### RecommendationReason
| Giá trị | Mô tả |
|---------|-------|
| None | Không có lý do cụ thể |
| FavouriteCategory | Khớp danh mục yêu thích |
| PreferredDifficulty | Khớp độ khó mong muốn |
| WeakAreaImprovement | Cải thiện điểm yếu |
| SimilarToEnrolledCourse | Tương tự khóa học đã đăng ký |
| PopularInCategory | Phổ biến trong danh mục |
| CollaborativeSimilarStudents | Được yêu thích bởi học viên tương đồng |
| UpcomingContest | Cuộc thi đang/sắp diễn ra |
| FreePractice | Luyện tập tự do |

### RecommendationFeedback
| Giá trị | Mô tả |
|---------|-------|
| Helpful | Hữu ích |
| NotHelpful | Không hữu ích |
| Shown | Đã hiển thị (mặc định) |
| Enrolled | Đã đăng ký |
| Dismissed | Đã bỏ qua |

### RecommendationSource
| Giá trị | Mô tả |
|---------|-------|
| HomePage | Từ trang chủ |
| CourseDetail | Từ trang chi tiết khóa học |
| CategoryPage | Từ trang danh mục |
| WeakAreaPage | Từ trang điểm yếu |

---

## 8. CẤU HÌNH HỆ THỐNG (appsettings.json)

| Thuộc tính | Giá trị mặc định | Mô tả |
|------------|------------------|-------|
| ContentWeight | 0.35 | Trọng số content-based |
| CollaborativeWeight | 0.25 | Trọng số collaborative |
| WeaknessWeight | 0.30 | Trọng số weakness-based |
| PopularityWeight | 0.10 | Trọng số popularity |
| WeaknessThreshold | 0.5 | Ngưỡng xác định điểm yếu |
| DefaultTopN | 10 | Số lượng mặc định |
| MaxTopN | 50 | Số lượng tối đa |

---

## 9. ĐÁNH GIÁ NGHIỆP VỤ

### 9.1 Điểm mạnh của hệ thống
1. **Hybrid approach tốt**: Kết hợp 4 signals đa dạng
2. **Collaborative filtering có ý nghĩa**: Tìm peer students theo pass rate ±0.15
3. **Skill profile chi tiết**: Theo (category, difficulty) bucket
4. **Explainability**: Có Reasons và Explanation cho từng gợi ý
5. **Analytics tracking**: Đầy đủ feedback và metrics

### 9.2 Điểm cần lưu ý
1. **Content-based đơn giản**: Chỉ dùng category affinity, chưa có semantic search thực sự (CourseEmbedding chưa được sử dụng trong scoring)
2. **Contest scoring**: Không có category của contest, chỉ dùng heuristic
3. **Cold start**: Học viên mới chưa có profile sẽ ít personalized

### 9.3 Đề xuất cải thiện
1. Sử dụng CourseEmbedding với pgvector để tăng cường content-based
2. Thêm category vào Contest entity để cải thiện contest recommendations
3. Thêm fallback strategy cho cold start users

---

**Tài liệu này được tạo tự động từ việc phân tích source code CourseMate**
**Ngày: 02/07/2026**
