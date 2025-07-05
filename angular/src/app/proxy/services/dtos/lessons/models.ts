import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateLessonDto {
  id?: string;
  title?: string;
  contentText?: string;
  videoUrl?: string;
  duration?: string;
  chapterId?: string;
}

export interface LessonDto extends AuditedEntityDto<string> {
  title?: string;
  contentText?: string;
  videoUrl?: string;
  duration?: string;
  chapterId?: string;
}
