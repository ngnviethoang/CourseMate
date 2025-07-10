import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateLessonDto extends EntityDto {
  chapterId?: string;
  name?: string;
  code?: string;
  note?: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  thumbnail?: string;
  timeCreated?: string;
  position: number;
}

export interface GetListLessonRequestDto extends PagedAndSortedResultRequestDto {
  chapterId?: string;
}

export interface LessonDto {
  id?: string;
  chapterId?: string;
  name?: string;
  code?: string;
  note?: string;
  description?: string;
  duration?: string;
  videoUrl?: string;
  thumbnail?: string;
  timeCreated?: string;
  position: number;
}

export interface UpdateLessonDto extends LessonDto {
}
