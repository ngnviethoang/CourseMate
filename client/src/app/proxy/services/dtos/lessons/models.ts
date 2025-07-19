import type { AuditedEntityDto } from '@abp/ng.core';

export interface LessonDto extends AuditedEntityDto<string> {
  title?: string;
  contentText?: string;
  videoFile?: string;
  duration?: string;
  chapterId?: string;
  position: number;
}

export interface CreateUpdateLessonDto {
  title?: string;
  contentText?: string;
  videoFile?: string;
  duration?: string;
  chapterId?: string;
  position: number;
}
