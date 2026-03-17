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
