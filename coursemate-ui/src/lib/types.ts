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

export interface RegisterCommand {
  userName: string
  email: string
  password: string
  role: 'Student' | 'Instructor'
}

export interface LoginResponse {
  accessToken: string
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
  studentId: string
  studentName: string
  studentEmail: string
  totalAmount: number
  status: string
  itemsCount: number
  creationTime: string
  items: AdminOrderItemDto[]
}

export interface UpdateOrderRequest {
  id: string
  status: string
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

export type LessonType = 'Video' | 'Reading' | 'Quiz' | 'Coding'

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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string
  userName?: string
  email?: string
  phoneNumber?: string
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
  videoUrl?: string
  readingContent?: string
  problemStatement?: string
  starterCode?: string
  expectedOutput?: string
  quizDescription?: string
  quizPassingScore?: number
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
  studentId: string
  totalAmount: number
  status: string
  items: OrderItemDto[]
}

// upload 
export interface UploadVideoInitRequest {
  fileName: string,
  fileSize: number,
}

export interface UploadVideoChunkRequest {
  fileId: string,
  chunkIndex: number,
  file: File,
}

export interface UploadVideoCompleteRequest {
  fileId: string,
  totalChunks: number,
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
