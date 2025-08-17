import type { AuditedEntityDto } from '@abp/ng.core';
import type { CurrencyType } from '../../../entities/courses/currency-type.enum';
import type { LevelType } from '../../../entities/courses/level-type.enum';
import type { ChapterDto } from '../chapters/models';
import type { CategoryDto } from '../categories/models';
import type { GetListRequestDto } from '../models';

export interface AuthorDto {
  userName?: string;
  avatar?: string;
}

export interface CourseDto extends AuditedEntityDto<string> {
  title?: string;
  description?: string;
  summary?: string;
  thumbnailFile?: string;
  price: number;
  currency?: CurrencyType;
  levelType?: LevelType;
  isActive: boolean;
  instructorId?: string;
  categoryId?: string;
  slug?: string;
  author: AuthorDto;
  totalLessons?: number;
  totalStudents?: number;
  chapters: ChapterDto[];
  isInCart: boolean;
  isEnrollment: boolean;
  category: CategoryDto;
}

export interface CreateUpdateCourseDto {
  title?: string;
  description?: string;
  summary?: string;
  thumbnailFile?: string;
  price: number;
  currency?: CurrencyType;
  levelType?: LevelType;
  isActive: boolean;
  categoryId?: string;
}

export interface GetListCourseRequestDto extends GetListRequestDto {
  categoryId?: string;
}
