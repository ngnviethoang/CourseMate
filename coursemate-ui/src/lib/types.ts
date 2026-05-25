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
  creationTime: string
  lastModificationTime?: string
}

export interface CourseDetailDto extends CourseDto {
  chapters: (ChapterDto & { lessons: LessonDto[] })[]
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
  position: number
  creationTime: string
  lastModificationTime?: string
}

export interface CreateChapterRequest {
  courseId: string
  title: string
  position: number
}

export interface UpdateChapterRequest {
  courseId: string
  title: string
  position: number
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
  position: number
  creationTime: string
  lastModificationTime?: string
}

export interface CreateLessonRequest {
  chapterId: string
  courseId: string
  title: string
  lessonType: LessonType
  position: number
}

export interface UpdateLessonRequest {
  chapterId: string
  courseId: string
  title: string
  lessonType: LessonType
  position: number
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
  position: number
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
  position: number
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
  position: number
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
  examples: ExerciseExampleDto[]
  constraints: string[]
  hints: string[]
  testCases: (Partial<ExerciseTestCaseDto> & Omit<ExerciseTestCaseDto, 'id'>)[]
  defaultCodes: (Partial<ExerciseDefaultCodeDto> & Omit<ExerciseDefaultCodeDto, 'id'>)[]
}
