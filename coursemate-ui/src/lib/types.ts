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
}

export interface UpdateUserRequest {
  userName: string
  email: string
  phoneNumber: string
}

// ─── Student Types ────────────────────────────────────────────────────────────

export interface StudentLessonDetailDto {
  id: string
  title: string
  lessonType: string
  position: number
  isCompleted: boolean
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
  status: number
  items: OrderItemDto[]
}
