import type { LessonDto } from '../lessons/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface ChapterDto {
  id?: string;
  courseId?: string;
  name?: string;
  code?: string;
  note?: string;
  thumbnail?: string;
  timeCreated?: string;
  position: number;
  lessons: LessonDto[];
}

export interface CreateChapterDto {
  courseId?: string;
  name?: string;
  code?: string;
  note?: string;
  thumbnail?: string;
  timeCreated?: string;
  position: number;
}

export interface GetListChapterRequestDto extends PagedAndSortedResultRequestDto {
  courseId?: string;
}

export interface UpdateChapterDto extends CreateChapterDto {
  id?: string;
}
