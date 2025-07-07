import type { AuditedEntityDto } from '@abp/ng.core';

export interface ChapterDto extends AuditedEntityDto<string> {
  title?: string;
  courseId?: string;
  courseTitle?: string;
  sortNumber: number;
}

export interface CreateUpdateChapterDto {
  title?: string;
  courseId?: string;
  sortNumber: number;
}
