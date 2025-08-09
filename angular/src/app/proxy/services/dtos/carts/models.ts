import type { AuditedEntityDto } from '@abp/ng.core';
import type { CourseDto } from '../courses/models';

export interface CartDto extends AuditedEntityDto<string> {
  courseId?: string;
  studentId?: string;
  course: CourseDto;
}

export interface CreateCartDto {
  courseId?: string;
}

export interface GetListCartRequestDto {
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
  studentId?: string;
}
