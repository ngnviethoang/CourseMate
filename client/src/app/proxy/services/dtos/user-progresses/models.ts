import type { LessonType } from '../../../entities/lessons/lesson-type.enum';

export interface ChapterProgressDto {
  chapterId?: string;
  title?: string;
  position: number;
  courseId?: string;
  lessons: LessonProgressDto[];
}

export interface CourseProgressDto {
  courseId?: string;
  title?: string;
  position: number;
  chapters: ChapterProgressDto[];
}

export interface CreateUpdateUserProgressDto {
  lessonId?: string;
  isCompleted: boolean;
  watchedDuration?: string;
}

export interface LessonProgressDto {
  lessonId?: string;
  userProgressId?: string;
  title?: string;
  type?: LessonType;
  chapterId?: string;
  position: number;
  duration?: string;
  isCompleted: boolean;
  watchedDuration?: string;
}
