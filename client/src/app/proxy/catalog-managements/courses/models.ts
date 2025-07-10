import type { ChapterDto } from '../chapters/models';
import type { CategoryDto } from '../categories/models';
import type { ReviewDto } from '../../user-managements/reviews/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AuthorDto {
  userName?: string;
  avatar?: string;
  bio?: string;
}

export interface CourseDto {
  id?: string;
  name?: string;
  code?: string;
  note?: string;
  description?: string;
  newPrice: number;
  oldPrice: number;
  discount: number;
  authorId?: string;
  author: AuthorDto;
  thumbnail?: string;
  timeCreated?: string;
  chapters: ChapterDto[];
  categoryId?: string;
  category: CategoryDto;
  totalLessons: number;
  totalStudents: number;
  highlights: string[];
  relativeCourses: CourseDto[];
  top5Reviews: ReviewDto[];
}

export interface CreateCourseDto {
  name?: string;
  code?: string;
  note?: string;
  description?: string;
  price: number;
  thumbnail?: string;
  categoryId?: string;
}

export interface GetListCourseRequestDto extends PagedAndSortedResultRequestDto {
  categoryId?: string;
}

export interface UpdateCourseDto {
  id?: string;
  name?: string;
  code?: string;
  note?: string;
  description?: string;
  price: number;
  thumbnail?: string;
  categoryId?: string;
}
