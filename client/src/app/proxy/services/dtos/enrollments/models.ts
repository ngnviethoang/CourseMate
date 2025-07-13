import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateEnrollmentDto {
  studentId?: string;
  courseId?: string;
  isCompleted: boolean;
}

export interface EnrollmentDto extends AuditedEntityDto<string> {
  studentId?: string;
  courseId?: string;
  isCompleted: boolean;
}
