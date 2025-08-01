import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CourseDto, CreateUpdateCourseDto, GetListCourseRequestDto } from '../dtos/courses/models';
import type { ResultObjectDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResultObjectDto>({
      method: 'POST',
      url: '/api/app/course',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
      method: 'GET',
      url: `/api/app/course/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySlug = (slug: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
      method: 'GET',
      url: '/api/app/course/by-slug',
      params: { slug },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListCourseRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseDto>>({
      method: 'GET',
      url: '/api/app/course',
      params: { categoryId: input.categoryId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
      method: 'PUT',
      url: `/api/app/course/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
