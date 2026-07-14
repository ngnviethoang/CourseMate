// ─── Shared ───────────────────────────────────────────────────────────────────

export interface PagedDto<T> {
  items: T[]
  pageIndex: number
  pageSize: number
  totalCount: number
}

export interface ResultIdDto {
  id: string
}

export interface LookupItemDto {
  id: string
  value: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCommand {
  userName: string
  password: string
}

export enum RegisterRole {
  Student = 'Student',
  Instructor = 'Instructor'
}

export interface RegisterCommand {
  userName: string
  email: string
  password: string
  role: RegisterRole
}

export interface LoginResponse {
  accessToken: string
}

export interface VerifyEmailRequest {
  userId: string
  token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  token: string
  newPassword: string
}

export interface SelectRoleRequest {
  role: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryDto {
  id: string
  name: string
  description: string
  isActive: boolean
  courseCount: number
  creationTime: string
  lastModificationTime?: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  isActive: boolean
}

export interface UpdateCategoryRequest {
  name: string
  description: string
  isActive: boolean
}

// order
export interface AdminOrderItemDto {
  id: string
  orderId: string
  courseId: string
  courseTitle: string
  price: number
}

export interface AdminOrderDto {
  id: string
  title: string
  studentId: string
  studentName: string
  studentEmail: string
  totalAmount: number
  status: string
  itemsCount: number
  creationTime: string
  lastModificationTime?: string
  items: AdminOrderItemDto[]
}

export interface UpdateOrderRequest {
  id: string
  status: string
}

export interface CreateOrderRequest {
  cartItemIds: string[]
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface CourseDto {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  isPublished: boolean
  categoryId: string
  categoryName: string
  instructorId: string
  instructorName?: string
  isInCart: boolean
  isEnrollment: boolean
  creationTime: string
  lastModificationTime?: string
}

export interface CourseDetailDto extends CourseDto {
  chapters: (ChapterDto & { lessons: LessonDto[] })[]
  averageRating?: number
  totalReviews?: number
}

export interface CreateCourseRequest {
  title: string
  description: string
  price: number
  imageUrl: string
  isPublished: boolean
  categoryId: string
  instructorId: string
}

export interface UpdateCourseRequest {
  title: string
  description: string
  price: number
  imageUrl: string
  isPublished: boolean
  categoryId: string
  instructorId: string
}

// ─── Chapter ──────────────────────────────────────────────────────────────────

export interface ChapterDto {
  id: string
  courseId: string
  courseName: string
  title: string
  position: string
  sortOrder: number
  creationTime: string
  lastModificationTime?: string
}

export interface CreateChapterRequest {
  courseId: string
  title: string
  sortOrder: number
}

export interface UpdateChapterRequest {
  courseId: string
  title: string
  sortOrder: number
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

export enum LessonType {
  Video = 'Video',
  Reading = 'Reading',
  Coding = 'Coding',
  Quiz = 'Quiz',
  Slide = 'Slide'
}

export interface LessonDto {
  id: string
  chapterId: string
  chapterName: string
  courseId: string
  courseName: string
  title: string
  lessonType: LessonType
  position: string
  sortOrder: number
  creationTime: string
  lastModificationTime?: string
}

export interface CreateLessonRequest {
  chapterId: string
  courseId: string
  title: string
  lessonType: LessonType
  sortOrder: number
}

export interface UpdateLessonRequest {
  chapterId: string
  courseId: string
  title: string
  lessonType: LessonType
  sortOrder: number
}

export interface QuizAnswerDto {
  id?: string
  text: string
  isCorrect: boolean
  position: number
}

export interface QuizQuestionDto {
  id?: string
  text: string
  position: number
  answers: QuizAnswerDto[]
}

export interface LessonDetailDto {
  id: string
  title: string
  lessonType: LessonType
  position: string
  sortOrder: number
  isCompleted: boolean
  score?: number
  // Video
  videoUrl?: string
  // Reading
  readingContent?: string
  // Coding
  exerciseId?: string
  exerciseTitle?: string
  // Quiz
  quizDescription?: string
  quizPassingScore?: number
  quizQuestions?: QuizQuestionDto[]
  // Slide
  slideFileUrl?: string
}

export interface UpsertLessonVideoRequest {
  videoUrl: string
}

export interface UpsertLessonReadingRequest {
  content: string
}

export interface UpsertLessonCodingRequest {
  exerciseId: string
}

export interface UpsertLessonQuizRequest {
  description: string
  passingScore: number
  questions: QuizQuestionDto[]
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string
  userName?: string
  email?: string
  phoneNumber?: string
  isApproved: boolean
  isLockedOut: boolean
  creationTime: string
  lastModificationTime?: string
}

export interface CreateUserRequest {
  userName: string
  email: string
  phoneNumber: string
  password: string
  role?: string
}

export interface UpdateUserRequest {
  userName: string
  email: string
  phoneNumber: string
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileDto {
  id: string
  userName: string
  email?: string
  phoneNumber?: string
  roles: string[]
}

export interface UpdateProfileRequest {
  userName: string
  email?: string
  phoneNumber?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface StudentMyCourseDto extends CourseDto {
  progressPercentage: number
  totalLessons: number
  completedLessons: number
  lastLessonTitle?: string
}

// ─── Student Types ────────────────────────────────────────────────────────────

export interface StudentLessonDetailDto {
  id: string
  title: string
  lessonType: LessonType
  position: string
  sortOrder: number
  isCompleted: boolean
  score?: number
  videoUrl?: string
  readingContent?: string
  exerciseId?: string
  exerciseTitle?: string
  quizDescription?: string
  quizPassingScore?: number
  quizQuestions?: QuizQuestionDto[]
  slideFileUrl?: string
}

export interface StudentChapterDetailDto {
  id: string
  title: string
  position: string
  sortOrder: number
  lessons: StudentLessonDetailDto[]
}

export interface StudentCourseDetailDto {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  categoryId: string
  categoryName: string
  instructorId: string
  instructorName: string
  isEnrolled: boolean
  progressPercentage: number
  chapters: StudentChapterDetailDto[]
  averageRating?: number
  totalReviews?: number
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface ReviewDto {
  id: string
  courseId: string
  studentId: string
  studentName: string
  studentAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewCourseRequest {
  rating: number
  comment: string
}

export interface CartItemDto {
  id: string
  courseId: string
  courseTitle: string
  courseImageUrl: string
  instructorName: string
  price: number
}

export interface CartDto {
  id: string
  studentId: string
  totalPrice: number
  items: CartItemDto[]
}

export interface OrderItemDto {
  id: string
  courseId: string
  courseTitle: string
  courseImageUrl: string
  price: number
}

export interface OrderDto {
  id: string
  title: string
  studentId: string
  studentName?: string
  studentEmail?: string
  totalAmount: number
  status: string
  itemsCount?: number
  creationTime: string
  lastModificationTime?: string
  items: OrderItemDto[]
}

// upload
export interface UploadVideoInitRequest {
  fileName: string
  fileSize: number
}

export interface UploadVideoChunkRequest {
  fileId: string
  chunkIndex: number
  file: File
}

export interface UploadVideoCompleteRequest {
  fileId: string
  totalChunks: number
}
// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface MonthlyRevenueDto {
  month: string
  revenue: number
}

export interface TopCourseDto {
  id: string
  title: string
  enrollmentCount: number
  revenue: number
}

export interface TopInstructorDto {
  id: string
  name: string
  courseCount: number
  totalRevenue: number
}

export interface DashboardDto {
  totalRevenue: number
  totalStudents: number
  totalCourses: number
  totalOrders: number
  revenueByMonth: MonthlyRevenueDto[]
  topCourses: TopCourseDto[]
  topInstructors: TopInstructorDto[]
}
// ─── AI Outline ───────────────────────────────────────────────────────────────

export interface LectureSlide {
  slideNumber: number
  title: string
  bullets: string[]
  relatedLinks: string[]
}

export interface LectureOutline {
  lessonTitle: string
  relatedLinks: string[]
  slides: LectureSlide[]
}

export interface OutlineDto {
  lessonId: string
  lessonMaterialId: string
  lectureOutline: LectureOutline
}

export interface ProcessingStatusDto {
  lessonMaterialId: string
  lessonId: string
}

export interface UpdateOutlineRequest {
  lessonMaterialId: string
  lectureOutline: LectureOutline
}
// ─── Code Runner ──────────────────────────────────────────────────────────────

export interface LanguageDto {
  id: string
  name: string
}

export interface RunCodeRequest {
  compiler: string
  code: string
  input?: string
}

export interface RunCodeResponse {
  output: string
  error: string
  status: string
  exit_code: number
  time: string
  total: string
  memory: string
}

// ─── Exercise ─────────────────────────────────────────────────────────────────

export interface ExerciseTestCaseDto {
  id: string
  input: string
  expectedOutput: string
  description: string
  isHidden: boolean
}

export interface ExerciseDefaultCodeDto {
  id: string
  language: string
  starterCode: string
}

export interface ExerciseExampleDto {
  input: string
  output: string
  explanation?: string
}

export interface ExerciseDto {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  testCaseCount: number
  isHidden: boolean
  creatorId?: string
  creatorName?: string
  creationTime: string
  lastModificationTime?: string
}

export interface ExerciseDetailDto extends ExerciseDto {
  examples: ExerciseExampleDto[]
  constraints: string[]
  hints: string[]
  testCases: ExerciseTestCaseDto[]
  defaultCodes: ExerciseDefaultCodeDto[]
}

export interface CreateExerciseRequest {
  title: string
  description: string
  difficulty: string
  category: string
  examples: ExerciseExampleDto[]
  constraints: string[]
  hints: string[]
  testCases: Omit<ExerciseTestCaseDto, 'id'>[]
  defaultCodes: Omit<ExerciseDefaultCodeDto, 'id'>[]
}

export interface UpdateExerciseRequest {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
  isHidden?: boolean
  examples: ExerciseExampleDto[]
  constraints: string[]
  hints: string[]
  testCases: (Partial<ExerciseTestCaseDto> & Omit<ExerciseTestCaseDto, 'id'>)[]
  defaultCodes: (Partial<ExerciseDefaultCodeDto> & Omit<ExerciseDefaultCodeDto, 'id'>)[]
}

// ─── Recommendation Effectiveness (Admin) ─────────────────────────────────────

export interface RecommendationAnalyticsCourseDto {
  id: string
  title: string
  categoryName: string
  recommendedViews: number
  enrollments: number
  conversionRate: number
}

export interface RecommendationAnalyticsByCategoryDto {
  categoryName: string
  recommendedViews: number
  enrollments: number
  conversionRate: number
}

export interface RecommendationEffectivenessTrendPointDto {
  date: string
  recommendations: number
  enrollments: number
  conversionRate: number
}

export interface RecommendationEffectivenessMetricsDto {
  uniqueCoursesRecommended: number
  uniqueStudentsServed: number
  averageEnrollmentsPerActiveStudent: number
  personalizedShare: number
  personalizationStrategy: string
  activeSignals: string[]
}

export interface RecommendationEffectivenessDto {
  totalRecommendations: number
  convertedEnrollments: number
  overallConversionRate: number
  activeStudents: number
  studentsWithPersonalizedRecommendations: number
  coldStartStudents: number
  coldStartShare: number
  coursesAvailable: number
  coursesShown: number
  catalogCoverage: number
  topConvertingCourses: RecommendationAnalyticsCourseDto[]
  categoryBreakdown: RecommendationAnalyticsByCategoryDto[]
  dailyTrend: RecommendationEffectivenessTrendPointDto[]
  metrics: RecommendationEffectivenessMetricsDto
}

// ─── Student Skill Analysis (Self) ───────────────────────────────────────────

export interface OverallMasteryDto {
  masteryScore: number
  skillLevel: string
  totalAttempts: number
  passedAttempts: number
  passRate: number
  attemptedExercises: number
  categoriesCovered: number
}

export interface SkillAreaDto {
  category: string
  difficulty: string
  difficultyLevel: number
  totalAttempts: number
  passedAttempts: number
  passRate: number
  averageScore: number
  masteryScore: number
  isWeakArea: boolean
  summary: string
  improvementHints: string[]
  lastAttemptedAt: string
}

export interface SkillProgressPointDto {
  date: string
  submissions: number
  passed: number
  passRate: number
}

export interface RecommendedExerciseDto {
  id: string
  title: string
  category: string
  difficulty: string
  reason: string
  creatorName: string
}

export interface RecommendedCourseDto {
  id: string
  title: string
  categoryName: string
  reason: string
  instructorName: string
}

export interface StudentSkillAnalysisDto {
  studentId: string
  studentName: string
  generatedAt: string
  overall: OverallMasteryDto
  strengths: SkillAreaDto[]
  weakAreas: SkillAreaDto[]
  recentProgress: SkillProgressPointDto[]
  recommendedExercises: RecommendedExerciseDto[]
  recommendedCourses: RecommendedCourseDto[]
  tips: string[]
}
