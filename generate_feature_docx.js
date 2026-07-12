// Generate Feature Walkthrough DOCX for CourseMate presentation
const fs = require("fs");
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak } = docx;

const BLACK = "000000";
const ACCENT = "1F3A68";
const BG_LIGHT = "F4F7FB";
const BG_BLUE = "E8F0FE";
const BG_GREEN = "E8F5E9";
const BG_ORANGE = "FFF4D6";

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, color: opts.color, size: opts.size || 22 })],
  });
}
function bullet(text, opts = {}) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 21 })],
  });
}
function heading(text, level = HeadingLevel.HEADING_1) {
  const colorMap = { 1: ACCENT, 2: "2C5AA0", 3: "5C8DC4" };
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, color: colorMap[level] || ACCENT, size: level===1?32:level===2?26:22 })],
  });
}
function cell(text, opts = {}) {
  const { bold = false, fill = null, widthPct = null, align = AlignmentType.LEFT, color } = opts;
  return new TableCell({
    borders: cellBorders,
    width: widthPct ? { size: widthPct, type: WidthType.PERCENTAGE } : undefined,
    shading: fill ? { type: ShadingType.CLEAR, color: "auto", fill } : undefined,
    children: [new Paragraph({
      alignment: align,
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: String(text), bold, size: 20, color })],
    })],
  });
}

// ===========================================================
// CONTENT - Tổng quan từng phần thuyết trình
// ===========================================================

const intro = [
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: "COURSEMATE", bold: true, size: 56, color: ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "Feature Walkthrough — Tài liệu thuyết trình", italics: true, size: 28, color: "555555" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 360 },
    children: [new TextRun({ text: "Tổng hợp toàn bộ chức năng đã triển khai trong hệ thống CourseMate", size: 22, color: "888888" })],
  }),
  heading("Tổng quan kiến trúc", HeadingLevel.HEADING_1),
  bullet("Backend: ASP.NET Core 9 (Web API) + EF Core + PostgreSQL + pgvector (cho AI embedding)"),
  bullet("Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui"),
  bullet("Authentication: JWT Bearer + Cookie + Google OAuth (ASP.NET Identity)"),
  bullet("Real-time: 3 SignalR Hub (notification, chat, contest anti-cheat)"),
  bullet("Background jobs: Hangfire (12 jobs — email, AI embedding, recommendation build, contest auto-end…)"),
  bullet("AI: Google Gemini (embedding + generation + Google Search), với RAG retrieval trên pgvector"),
  bullet("Payment: PayOS (cổng thanh toán Việt Nam)"),
  bullet("Email: SMTP qua MailKit"),
  bullet("Code Runner: external OnlineCompiler API"),
  bullet("Logging: Serilog + HTTP logging middleware + x-request-id tracing"),
  bullet("Database: 43 entities, 2 DbContext (write + read-only no-tracking), soft-delete + audit"),
  bullet("Roles: Admin / Instructor / Student"),

  heading("Thống kê quy mô", HeadingLevel.HEADING_1),
  p("Tổng số tính năng đã triển khai (ước tính):", { bold: true }),
  bullet("17 Controllers backend + 3 SignalR Hubs + 1 Background Service"),
  bullet("~120+ HTTP endpoints"),
  bullet("49 trang Next.js + 86 components + 25 lib services + 4 custom hooks"),
  bullet("43 entities + 12 EF Core migrations"),
  bullet("9 module nghiệp vụ lớn"),
  bullet("20+ Hangfire jobs (recurring + one-shot)"),
];

const part1 = [
  heading("Phần 1 — Xác thực & Quản lý người dùng", HeadingLevel.HEADING_1),
  p("Mục đích: Cho phép học viên và giảng viên đăng ký, đăng nhập, bảo mật tài khoản, phân quyền theo role.", { italics: true }),

  heading("1.1 Authentication", HeadingLevel.HEADING_2),
  bullet("Đăng ký tài khoản mới (POST /api/auth/register): nhập email + username + password → gửi email xác thực"),
  bullet("Xác thực email bằng link (GET /api/auth/verify-email): click link trong email → kích hoạt tài khoản"),
  bullet("Đăng nhập bằng username hoặc email (POST /api/auth/login): cấp JWT token (kiểm tra EmailConfirmed, IsApproved, không bị khóa)"),
  bullet("Đăng nhập bằng Google OAuth: /api/auth/signin-google → redirect sang Google → callback /api/auth/google-callback → cấp JWT"),
  bullet("Quên mật khẩu (POST /api/auth/forgot-password): nhập email → gửi link reset qua email"),
  bullet("Đặt lại mật khẩu (POST /api/auth/reset-password): nhập token + password mới"),
  bullet("Đổi mật khẩu khi đã đăng nhập (POST /api/auth/change-password)"),
  bullet("Xem & cập nhật profile (GET / POST /api/auth/profile)"),

  heading("1.2 User Management (Admin)", HeadingLevel.HEADING_2),
  bullet("Danh sách người dùng có filter & phân trang (GET /api/users)"),
  bullet("Tạo / sửa / xóa user (POST / PUT / DELETE /api/users/{id})"),
  bullet("Duyệt giảng viên (POST /api/users/{id}/approve-instructor): admin duyệt tài khoản instructor"),
  bullet("Khóa / mở khóa tài khoản (POST /api/users/{id}/toggle-lock): khóa 1 user bất kỳ"),
  bullet("Phân quyền 3 roles: Admin / Instructor / Student (dùng ASP.NET Identity)"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Form đăng ký & email xác thực", { bold: true }),
  p("Quy trình duyệt instructor", { bold: true }),
  p("Luồng Google OAuth (popup sang Google, callback về app)", { bold: true }),
  p("Trang quản lý user dành cho Admin (table với pagination, filter)", { bold: true }),
];

const part2 = [
  heading("Phần 2 — Khóa học, Chương, Bài học", HeadingLevel.HEADING_1),
  p("Mục đích: Cấu trúc nội dung học tập từ khóa học → chương → bài học. Mỗi bài học có 4 loại: Video, Reading, Coding, Quiz.", { italics: true }),

  heading("2.1 Quản lý Course (CRUD + filter)", HeadingLevel.HEADING_2),
  bullet("Danh sách khóa học (GET /api/courses): phân trang + filter theo category, instructor, keyword"),
  bullet("Chi tiết khóa học (GET /api/courses/{id}): thông tin + chapters + reviews"),
  bullet("Khóa học tương tự (GET /api/courses/{id}/similar): AI dựa trên vector embedding"),
  bullet("Khóa học của tôi (GET /api/courses/my): student / instructor xem khóa đã đăng ký / dạy"),
  bullet("Tạo / sửa / xóa khóa học (Admin / Instructor): upload ảnh, chọn category, set giá, publish"),
  bullet("Mỗi lần save Course → phát sinh event → background job tự động tạo embedding + similarity"),

  heading("2.2 Chapter (Chương)", HeadingLevel.HEADING_2),
  bullet("CRUD chapter (GET / POST / PUT / DELETE /api/chapters)"),
  bullet("Sắp xếp bằng fractional indexing (chuỗi thập phân string): chèn giữa 2 chapter mà không cần đánh lại số"),

  heading("2.3 Lesson (Bài học) — 4 loại", HeadingLevel.HEADING_2),
  p("Mỗi lesson có LessonType = Video / Reading / Coding / Quiz. Tùy loại mà có entity con tương ứng:", { bold: true }),
  bullet("Video: lưu videoUrl trong bảng LessonVideo"),
  bullet("Reading: lưu nội dung HTML/Markdown trong LessonReading"),
  bullet("Coding: liên kết tới 1 bài tập (Exercise) trong LessonCoding"),
  bullet("Quiz: danh sách câu hỏi + đáp án trong LessonQuiz / LessonQuizQuestion / LessonQuizAnswer"),

  p("Endpoints quản lý lesson:", { bold: true }),
  bullet("GET /api/lessons — danh sách"),
  bullet("GET /api/lessons/{id}/detail — bundle data cho player (video, reading, coding, quiz)"),
  bullet("POST /api/lessons — tạo"),
  bullet("PUT /api/lessons/{id}/video — upsert video URL"),
  bullet("PUT /api/lessons/{id}/reading — upsert reading content"),
  bullet("PUT /api/lessons/{id}/coding — upsert coding liên kết Exercise"),
  bullet("PUT /api/lessons/{id}/quiz — upsert câu hỏi + đáp án"),
  bullet("PUT /api/lessons/{id}/progress — student đánh dấu hoàn thành"),
  bullet("DELETE /api/lessons/{id} — xóa"),

  heading("2.4 Review (Đánh giá)", HeadingLevel.HEADING_2),
  bullet("GET /api/courses/{id}/reviews — xem review (ai cũng xem được)"),
  bullet("POST /api/courses/{id}/reviews — student viết review (rating 1–5 + comment)"),

  heading("2.5 Category", HeadingLevel.HEADING_2),
  bullet("Admin CRUD category (POST / PUT / DELETE /api/categories)"),
  bullet("Public xem danh sách (GET /api/categories)"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Cấu trúc phân cấp: Category → Course → Chapter → Lesson", { bold: true }),
  p("4 loại bài học, mỗi loại 1 player riêng", { bold: true }),
  p("Demo: tạo course → thêm chapter → thêm 4 bài (mỗi loại 1)", { bold: true }),
  p("Trang xem chi tiết course (public) + trang học (student)", { bold: true }),
];

const part3 = [
  heading("Phần 3 — AI: Tự động sinh slide & Reading từ tài liệu", HeadingLevel.HEADING_1),
  p("Mục đích: Upload tài liệu (PDF, Word, …) → hệ thống dùng AI chia thành slide hoặc tóm tắt reading.", { italics: true }),

  heading("3.1 Quy trình", HeadingLevel.HEADING_2),
  bullet("Bước 1 — Upload: POST /api/lessons/{lessonId}/materials/bullet-slide (hoặc reading-outline)"),
  bullet("Bước 2 — Tạo bản ghi LessonMaterial status = Processing"),
  bullet("Bước 3 — Background job chunk file + sinh embedding (pgvector)"),
  bullet("Bước 4 — Gọi AI Gemini search thông tin bổ sung (Google Search tool)"),
  bullet("Bước 5 — AI sinh outline (slide bullets hoặc reading text) → lưu vào LessonMaterial.Outline"),
  bullet("Bước 6 — Realtime notify qua SignalR khi xử lý xong → status = Completed"),
  bullet("Bước 7 — User xem outline (GET /api/lessons/{lessonId}/outline) và có thể chỉnh sửa (PUT)"),

  heading("3.2 Công nghệ AI", HeadingLevel.HEADING_2),
  bullet("Embedding: Gemini embedding-001 (768-dim) lưu vào pgvector"),
  bullet("Generation: Gemini 2.5-flash (fallback flash-lite) temperature 0.2, max 4096 tokens"),
  bullet("Web Search: tích hợp Google Search tool trong Gemini"),
  bullet("Background job: GenerateOutlineJob (Hangfire)"),


  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Upload 1 file tài liệu → vài giây sau có 1 bộ slide hoàn chỉnh", { bold: true }),
  p("So sánh với slide tự làm thủ công", { bold: true }),
  p("Highlight: search Google tự động để bổ sung kiến thức ngoài tài liệu", { bold: true }),
];

const part4 = [
  heading("Phần 4 — Code Execution & Bài tập lập trình", HeadingLevel.HEADING_1),
  p("Mục đích: Cho học viên luyện tập lập trình với bài tập có test case, chạy code online và xem điểm.", { italics: true }),

  heading("4.1 Exercise (Bài tập)", HeadingLevel.HEADING_2),
  bullet("CRUD bài tập (Admin / Instructor): title, difficulty (Easy/Medium/Hard), category, hidden flag"),
  bullet("Quản lý Example (input/output mẫu cho học viên xem)"),
  bullet("Quản lý TestCase: chia thành 2 loại — công khai (hiển thị) và ẩn (chấm điểm)"),
  bullet("Quản lý DefaultCode: code khởi tạo cho từng ngôn ngữ (Python, Java, C++, JS, …)"),

  heading("4.2 Code Runner", HeadingLevel.HEADING_2),
  bullet("Gọi external OnlineCompiler API để thực thi code (POST /api/code-runner)"),
  bullet("Trả về: status, exitCode, output, error"),
  bullet("GET /api/code-runner (anonymous) — danh sách ngôn ngữ compilers được hỗ trợ"),
  bullet("Frontend dùng Monaco Editor (IDE trên web tương tự VS Code)"),

  heading("4.3 Nộp bài & Lịch sử", HeadingLevel.HEADING_2),
  bullet("POST /api/exercises/{id}/submissions — gửi code → hệ thống chạy với tất cả test case (cả ẩn) → trả điểm"),
  bullet("GET /api/exercises/{id}/submissions — xem lịch sử nộp của student"),
  bullet("Điểm = (số test pass / tổng) * 100"),
  bullet("Bài tập đề xuất (GET /api/exercises/recommended) — dựa trên weak areas từ skill analysis"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Demo viết code Python trong Monaco editor → nộp → xem điểm", { bold: true }),
  p("Trang danh sách exercises + filter difficulty", { bold: true }),
  p("Test case ẩn giúp chống gian lận 'hardcode output'", { bold: true }),
];

const part5 = [
  heading("Phần 5 — AI Chat (RAG) — Hỏi đáp tài liệu", HeadingLevel.HEADING_1),
  p("Mục đích: Học viên chat với AI để hỏi đáp trong phạm vi tài liệu của khóa học/bài học. AI lấy context từ vector embedding trước khi trả lời.", { italics: true }),

  heading("5.1 Cơ chế RAG (Retrieval-Augmented Generation)", HeadingLevel.HEADING_2),
  bullet("Bước 1 — Nhận câu hỏi + 6 turn gần nhất trong history"),
  bullet("Bước 2 — Embed câu hỏi → cosine search top-K trong FileEntryEmbedding (filtered theo CourseId / LessonId)"),
  bullet("Bước 3 — Lấy ra các đoạn text ngữ cảnh"),
  bullet("Bước 4 — Gọi Gemini với prompt: history + context + question"),
  bullet("Bước 5 — Lưu message vào ChatMessage kèm SourceChunkIds (truy vết nguồn)"),

  heading("5.2 Quản lý hội thoại", HeadingLevel.HEADING_2),
  bullet("Tạo conversation (POST /api/chat/conversations): liên kết với CourseId / LessonId"),
  bullet("Danh sách conversations (GET /api/chat/conversations)"),
  bullet("Lấy messages (GET /api/chat/conversations/{id}/messages)"),
  bullet("Xóa conversation (DELETE /api/chat/conversations/{id})"),

  heading("5.3 SignalR ChatHub", HeadingLevel.HEADING_2),
  bullet("Kết nối tới /hubs/chat bằng JWT (trong query access_token)"),
  bullet("Gửi message qua SendMessage — server trả về ReceiveMessageComplete với full ChatAnswerDto"),

  heading("5.4 UI", HeadingLevel.HEADING_2),
  bullet("ChatWidget (component) nổi ở góc phải màn hình student"),
  bullet("Hiển thị các câu trả lời dạng streaming (từng từ)"),
  bullet("Hiển thị nguồn (file chunks) để user click xem tài liệu gốc"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Mở chat từ trong 1 lesson → hỏi về nội dung bài học → AI trả lời kèm trích dẫn từ tài liệu", { bold: true }),
  p("So sánh câu trả lời general (Google) vs câu trả lời dựa trên tài liệu khóa học", { bold: true }),
];

const part6 = [
  heading("Phần 6 — Thương mại & Thanh toán (Cart → Order → PayOS)", HeadingLevel.HEADING_1),

  heading("6.1 Enrollment miễn phí", HeadingLevel.HEADING_2),
  bullet("Student nhấn vào khóa học miễn phí → POST /api/enrollments/free → thêm Enrollment → có thể học ngay"),

  heading("6.2 Giỏ hàng (Cart)", HeadingLevel.HEADING_2),
  bullet("Mỗi user có 1 cart (1-1)"),
  bullet("POST /api/carts — thêm khóa học vào giỏ"),
  bullet("GET /api/carts — xem giỏ"),
  bullet("DELETE /api/carts/{id} — xóa 1 item"),

  heading("6.3 Order", HeadingLevel.HEADING_2),
  bullet("POST /api/orders — tạo order từ cart (lưu OrderItem từng khóa)"),
  bullet("GET /api/orders — danh sách order (admin: tất cả, student: của mình)"),
  bullet("PUT /api/orders/{id} — cập nhật trạng thái (admin)"),

  heading("6.4 Thanh toán PayOS", HeadingLevel.HEADING_2),
  bullet("POST /api/payments/create-url — tạo URL thanh toán PayOS (Vietnamese payment gateway)"),
  bullet("User redirect sang PayOS → thanh toán → PayOS redirect về /payment/success hoặc /payment/cancel"),
  bullet("PayOS server gọi webhook IPN (POST /api/payments/payos-ipn) để xác nhận thanh toán → cập nhật PaymentTransaction status = Paid → tự động tạo Enrollment"),
  bullet("POST /api/payments/fake-payos-ipn — webhook giả lập (chỉ dùng dev)"),

  heading("6.5 Favorite (Yêu thích)", HeadingLevel.HEADING_2),
  bullet("GET /api/favorites — danh sách khóa học yêu thích"),
  bullet("POST /api/favorites — toggle (thêm / bỏ) khóa học khỏi yêu thích"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Demo flow mua hàng: thêm vào giỏ → checkout → quay về success page", { bold: true }),
  p("Nhấn mạnh: tích hợp cổng VN (PayOS) thay vì Stripe quốc tế", { bold: true }),
];

const part7 = [
  heading("Phần 7 — Cuộc thi lập trình & Anti-Cheat", HeadingLevel.HEADING_1),
  p("Mục đích: Tổ chức cuộc thi code online với giám sát vi phạm real-time, giải thưởng và bảng xếp hạng.", { italics: true }),

  heading("7.1 CRUD Contest", HeadingLevel.HEADING_2),
  bullet("Admin/Instructor tạo Contest với: title, status (Upcoming/Ongoing/Ended/Cancelled), startTime, endTime, durationInMinutes, maxViolations"),
  bullet("Thêm Exercise vào Contest (POST /api/contests/{id}/exercises), có ScoreWeight và Order"),
  bullet("Cấu hình giải thưởng (POST /api/contests/{id}/prizes): gắn CourseId + khoảng rank (minRank/maxRank)"),

  heading("7.2 Student flow", HeadingLevel.HEADING_2),
  bullet("Đăng ký thi (POST /api/contests/{id}/register): ghi vào ContestRegistration"),
  bullet("Check-in (POST /api/contests/{id}/check-in): trước khi bắt đầu"),
  bullet("Vào workspace (GET /api/contests/{id}/workspace): mở editor làm bài"),
  bullet("Nộp bài (POST /api/contests/{id}/exercises/{exerciseId}/submit)"),
  bullet("Hoàn thành (POST /api/contests/{id}/finish)"),
  bullet("Xem bảng xếp hạng (GET /api/contests/{id}/leaderboard)"),

  heading("7.3 Anti-Cheat (SignalR real-time)", HeadingLevel.HEADING_2),
  bullet("Vi phạm 6 loại: rời tab, copy/paste, screenshot, mở DevTools, dùng AI, trao đổi thông tin (tùy cấu hình)"),
  bullet("useAntiCheat hook (frontend) — bắt sự kiện browser: visibilitychange, copy, paste, keydown (Ctrl+S), fullscreen exit…"),
  bullet("Client gọi ReportViolation tới SignalR ContestHub, kèm: IP, X-Forwarded-For, userAgent, deviceFingerprint"),
  bullet("Server tăng ViolationCount cho student; nếu vượt MaxViolations → tự động disqualify → push ViolationWarning / ForceDisqualify"),
  bullet("Instructor join nhóm monitor (JoinContestMonitor) → nhận StudentViolation real-time"),
  bullet("Instructor có thể manual disqualify (POST /api/contests/{id}/disqualify/{studentId}) hoặc reinstate"),

  heading("7.4 Auto-end background", HeadingLevel.HEADING_2),
  bullet("ContestBackgroundService chạy mỗi 1 phút: nếu Contest.Ongoing và EndTime đã qua → tự động EndContest"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Trang thi (arena): code editor + timer + panel monitor", { bold: true }),
  p("Trang monitor dành cho giám sát viên: thấy danh sách thí sinh + realtime violations", { bold: true }),
  p("Demo: tạo contest → thí sinh tham gia → vi phạm rời tab → disqualify", { bold: true }),
];

const part8 = [
  heading("Phần 8 — Hệ thống gợi ý (Recommendation)", HeadingLevel.HEADING_1),
  p("Mục đích: Gợi ý khóa học phù hợp cho từng học viên, dựa trên sở thích, lịch sử học và điểm mạnh/yếu.", { italics: true }),

  heading("8.1 Recommendation types", HeadingLevel.HEADING_2),
  bullet("For-me: GET /api/recommendations/for-me — cá nhân hóa, fallback trending nếu rỗng"),
  bullet("Trending: GET /api/recommendations/trending — khóa hot (ai cũng xem được)"),
  bullet("Similar: GET /api/courses/{id}/similar — khóa tương tự (cosine trên vector embedding)"),

  heading("8.2 Background jobs (Hangfire, daily)", HeadingLevel.HEADING_2),
  bullet("RefreshStudentSkillProfilesJob — 3 AM: cập nhật mastery từ exercise submissions"),
  bullet("BuildCourseSimilarityJob — tính độ tương đồng giữa các course (cosine embedding)"),
  bullet("BuildCoOccurrenceJob — đếm số lần 2 course được học cùng nhau → xây CoOccurrence matrix"),
  bullet("BuildUserRecommendationsJob — gộp similarity + co-occurrence + skill profile → sinh UserRecommendation"),

  heading("8.3 Student Preference & Skill Profile", HeadingLevel.HEADING_2),
  bullet("StudentPreference (1-1 với user): favouriteCategories (jsonb), preferredDifficulty, skillLevel, autoRefresh flag"),
  bullet("StudentSkillProfile (1-n): mỗi dòng 1 category × difficulty → mastery score, total attempts, passed, isWeakArea"),
  bullet("Mastery = passRate * 0.7 + (avgScore / 100) * 0.3. Weak area khi mastery < 0.5"),

  heading("8.4 UI", HeadingLevel.HEADING_2),
  bullet("Recommended Courses component (home)"),
  bullet("Recommended Exercises Top 5 (home)"),
  bullet("Skill Analysis page: biểu đồ strength vs weak area + recommended exercises/courses"),
  bullet("Continue Learning: course đang học dở"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Trang home với các section: Continue Learning, Recommended Courses, Recommended Exercises", { bold: true }),
  p("Trang Skill Analysis với biểu đồ năng lực", { bold: true }),
];

const part9 = [
  heading("Phần 9 — Quản lý file / Video", HeadingLevel.HEADING_1),

  heading("9.1 Upload file thường", HeadingLevel.HEADING_2),
  bullet("POST /api/files — upload (multipart FormData) → trả về FileEntry"),
  bullet("GET /api/files/{fileId}/download — tải xuống (public)"),
  bullet("DELETE /api/files/{fileId} — xóa"),

  heading("9.2 Upload video (chunked)", HeadingLevel.HEADING_2),
  bullet("POST /api/files/videos/init — khởi tạo session (trả fileId)"),
  bullet("POST /api/files/videos/{fileId}/chunks/{chunkIndex} — upload từng chunk (1..100) — phù hợp file lớn"),
  bullet("POST /api/files/videos/completed — báo hoàn tất → Hangfire CompleteVideoUploadJob merge chunks + transcode/validate"),
  bullet("GET /api/files/videos/{fileId} — kiểm tra trạng thái"),
  bullet("GET /api/files/videos/stream/{fileId} — stream video (tagged obsolete)"),

  heading("9.3 Storage abstraction", HeadingLevel.HEADING_2),
  bullet("IFileStorageManager — interface thống nhất cho mọi storage"),
  bullet("LocalFileStorageManager — lưu trên filesystem (Storage public path)"),
  bullet("FakeStorageManager — in-memory (test)"),
  bullet("Có thể swap sang S3/Azure Blob mà không sửa business code"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Giải thích tại sao chunked upload quan trọng cho video lớn", { bold: true }),
  p("Demo: upload file 100MB theo chunk + progress bar", { bold: true }),
];

const part10 = [
  heading("Phần 10 — Notification, Banner, Dashboard", HeadingLevel.HEADING_1),

  heading("10.1 Notification (Real-time)", HeadingLevel.HEADING_2),
  bullet("REST: GET /api/notifications (list), GET /api/notifications/unread-count"),
  bullet("PUT /api/notifications/{id}/read (mark 1), PUT /api/notifications/read-all"),
  bullet("SignalR /hubs/notification — server push ReceiveNotification, DocumentProcessed, VideoProcessed"),
  bullet("NotificationDropdown component (icon chuông ở header, badge số chưa đọc)"),
  bullet("useNotifications hook (connect hub, listen events)"),

  heading("10.2 Banner quảng cáo (Home)", HeadingLevel.HEADING_2),
  bullet("Admin/Instructor CRUD banner (page /management/banners)"),
  bullet("Home hiển thị slider carousel"),

  heading("10.3 Dashboard", HeadingLevel.HEADING_2),
  bullet("GET /api/dashboard — admin/student/instructor overview"),
  bullet("Tổng doanh thu, tổng user, tổng course, tổng order"),
  bullet("Biểu đồ doanh thu 12 tháng (recharts)"),
  bullet("Top 5 courses, top 5 instructors"),
  bullet("GET /api/dashboard/recommendation-effectiveness — đo hiệu quả hệ thống đề xuất"),
  bullet("GET /api/dashboard/skill-analysis — phân tích năng lực học viên (recharts + tip)"),

  heading("10.4 Dev Tools (Local)", HeadingLevel.HEADING_2),
  bullet("POST /api/dev-tools/fake-notification — tạo và push notification giả"),
  bullet("POST /api/dev-tools/fake-email — enqueue Hangfire job gửi email demo"),


  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Hiển thị dashboard với 4 chart + 2 top list", { bold: true }),
  p("Demo notification realtime: mở 2 tab, action ở tab A → tab B nhận notif", { bold: true }),
];

const part11 = [
  heading("Phần 11 — Cấu hình kỹ thuật & Vận hành", HeadingLevel.HEADING_1),

  heading("11.1 Cross-cutting Concerns (Program.cs)", HeadingLevel.HEADING_2),
  bullet("GlobalExceptionHandler — map Exception → ProblemDetails + HTTP code (EntityNotFound → 403, Business → 403, Unauthorized → 401, BadRequest → 400)"),
  bullet("HttpLoggingMiddleware — đọc/ghi x-request-id, log request/response, scope logging"),
  bullet("Serilog cấu hình từ appsettings.json"),
  bullet("Swagger UI tại /swagger với JWT Bearer scheme + CamelCase + full schemaIds"),
  bullet("CORS: 'AllowAnyOrigin' cho REST + SignalRHubs policy riêng cho SignalR"),
  bullet("JSON: Newtonsoft + CamelCase + NullValueHandling.Ignore + StringEnumConverter"),
  bullet("Hangfire Dashboard enabled ở root path"),
  bullet("MediatR Pipeline Behaviors: LoggingBehavior + TransactionPipelineBehavior"),

  heading("11.2 Database", HeadingLevel.HEADING_2),
  bullet("2 DbContext: write (tracked) + read-only (no-tracking)"),
  bullet("PostgreSQL + pgvector extension (cho embedding)"),
  bullet("12 migrations: Initial, AddLessonQuizTables, AddExerciseSubmissionTables, AddAntiCheatViolationTable, AddContestPrizesTable, AddIsHiddenColumn, AddIsApprovedToUser, AddRecommendTables, …"),
  bullet("Soft delete + Audit columns trong mọi entity"),

  heading("11.3 Roles & Authorization", HeadingLevel.HEADING_2),
  bullet("3 roles: Admin, Instructor, Student"),
  bullet("Authorize attribute trên controller / endpoint"),
  bullet("Admin: duyệt instructor, khóa user, CRUD category, dashboard overview"),
  bullet("Instructor: CRUD course, lesson, exercise, contest của mình"),
  bullet("Student: học bài, nộp bài, thi contest, mua hàng, yêu thích"),

  heading("11.4 Real-time", HeadingLevel.HEADING_2),
  bullet("SignalR 3 hubs: notification, chat, contest"),
  bullet("JWT required trong access_token query"),
  bullet("Browser khởi tạo từ @microsoft/signalr client"),

  heading("11.5 Background Jobs (Hangfire)", HeadingLevel.HEADING_2),
  bullet("EmailSenderJob — immediate retry 3"),
  bullet("CompleteVideoUploadJob — sau khi upload video hoàn tất"),
  bullet("GenerateOutlineJob — sinh AI outline"),
  bullet("GenerateCourseEmbeddingJob — tạo embedding cho course"),
  bullet("GenerateLessonMaterialEmbeddingJob — tạo embedding cho lesson material"),
  bullet("BuildCourseSimilarityJob — daily"),
  bullet("BuildCoOccurrenceJob — daily"),
  bullet("BuildUserRecommendationsJob — daily"),
  bullet("RefreshStudentSkillProfilesJob — daily 3AM"),

  heading("Điểm thuyết trình gợi ý", HeadingLevel.HEADING_2),
  p("Show Pipeline Behaviors (logging + transaction)", { bold: true }),
  p("Hangfire Dashboard tại /jobs", { bold: true }),
  p("PostgreSQL với pgvector — tại sao dùng vector DB", { bold: true }),
];

const summary = [
  heading("Tổng kết & Q&A", HeadingLevel.HEADING_1),

  p("Tóm tắt theo góc nhìn 'tôi đã làm được gì':", { bold: true }),
  bullet("Một hệ thống LMS (Learning Management System) đầy đủ với 11 module nghiệp vụ"),
  bullet("3 role (Admin / Instructor / Student), phân quyền chặt chẽ"),
  bullet("Có AI ở 4 chỗ: Outline generator, Chat RAG, Recommendation, Embedding similarity"),
  bullet("Real-time với 3 SignalR hubs"),
  bullet("Background job pipeline (Hangfire) cho 12 job"),
  bullet("Code execution + Grading tự động với test case ẩn"),
  bullet("Cuộc thi lập trình với anti-cheat 6 lớp"),
  bullet("Thanh toán PayOS (VN) + Cart + Order + Enrollment"),
  bullet("Skill analysis & cá nhân hóa recommendation"),
  bullet("Video chunked upload + File storage abstraction"),

  heading("Số liệu ấn tượng để pitch", HeadingLevel.HEADING_2),
  bullet("43 entities + 12 EF Core migrations"),
  bullet("17 Controllers + 3 SignalR Hubs + 1 Background Service"),
  bullet("49 trang Next.js + 86 components + 25 lib services + 4 custom hooks"),
  bullet("~120 HTTP endpoints"),
  bullet("Stack: ASP.NET 9, EF Core, PostgreSQL + pgvector, Next.js 16, Tailwind 4, shadcn/ui"),

  heading("Các phần demo nên ưu tiên", HeadingLevel.HEADING_2),
  p("(nếu thuyết trình trong 30 phút, chọn 5 cái này)", { italics: true }),
  bullet("1) Upload tài liệu → AI sinh slide tự động (Part 3)"),
  bullet("2) Coding exercise với Monaco Editor + auto grade (Part 4)"),
  bullet("3) AI Chat RAG trong lesson (Part 5)"),
  bullet("4) Contest + Anti-cheat real-time (Part 7)"),
  bullet("5) Skill Analysis dashboard với recharts (Part 8 + 10)"),

  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 360 },
    children: [new TextRun({ text: "— Hết —", italics: true, color: "888888", size: 24 })],
  }),
];

// ===========================================================
// Assemble
// ===========================================================
function page(nodes) {
  return [...nodes, new Paragraph({ children: [new PageBreak()] })];
}
function lastPage(nodes) {
  return nodes; // no break after final page
}

const doc = new Document({
  creator: "CourseMate",
  title: "CourseMate Feature Walkthrough",
  description: "Tài liệu thuyết trình các chức năng CourseMate",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 },
      },
    },
    children: [
      ...page(intro),
      ...page(part1),
      ...page(part2),
      ...page(part3),
      ...page(part4),
      ...page(part5),
      ...page(part6),
      ...page(part7),
      ...page(part8),
      ...page(part9),
      ...page(part10),
      ...page(part11),
      ...lastPage(summary),
    ],
  }],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("CourseMate_Feature_Walkthrough.docx", buffer);
  console.log("Wrote CourseMate_Feature_Walkthrough.docx", buffer.length, "bytes");
})();
