import type { AuditedEntityDto } from '@abp/ng.core';
import type { LessonDto } from '../lessons/models';
import type { GetListRequestDto } from '../models';

export interface ChapterDto extends AuditedEntityDto<string> {
  title?: string;
  courseId?: string;
  courseTitle?: string;
  position: number;
  lessons: LessonDto[];
}

export interface CreateUpdateChapterDto {
  title?: string;
  courseId?: string;
  position: number;
}

export interface GetListChapterRequestDto extends GetListRequestDto {
  courseId?: string;
}
