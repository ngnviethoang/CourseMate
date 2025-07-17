import type { AuditedEntityDto } from '@abp/ng.core';
import type { CurrencyType } from '../../../entities/courses/currency-type.enum';
import type { LevelType } from '../../../entities/courses/level-type.enum';
import type { GetListRequestDto } from '../models';

export interface AuthorDto {
  userName?: string;
  avatar?: string;
}

export interface CourseDto extends AuditedEntityDto<string> {
  title?: string;
  description?: string;
  thumbnailFile?: string;
  price: number;
  currency?: CurrencyType;
  levelType?: LevelType;
  isPublished: boolean;
  instructorId?: string;
  categoryId?: string;
  author: AuthorDto;
  totalLessons?: number;
  totalStudents?: number;
}

export interface CreateUpdateCourseDto {
  title?: string;
  description?: string;
  thumbnailFile?: string;
  price: number;
  currency?: CurrencyType;
  levelType?: LevelType;
  isPublished: boolean;
  categoryId?: string;
}

export interface GetListCourseRequestDto extends GetListRequestDto {
  categoryId?: string;
}
