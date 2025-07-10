import type { CourseDto, CreateCourseDto, GetListCourseRequestDto, UpdateCourseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiName = 'Default';
  

  create = (input: CreateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
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
  

  get = (id: string, chapterIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
      method: 'GET',
      url: `/api/app/course/${id}`,
      params: { chapterIds },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListCourseRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CourseDto>>({
      method: 'GET',
      url: '/api/app/course',
      params: { categoryId: input.categoryId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateCourseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseDto>({
      method: 'PUT',
      url: `/api/app/course/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
