import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateLessonDto, LessonDto } from '../dtos/lessons/models';
import type { GetListRequestDto, ResultObjectDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLessonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResultObjectDto>({
      method: 'POST',
      url: '/api/app/lesson',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/lesson/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LessonDto>({
      method: 'GET',
      url: `/api/app/lesson/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LessonDto>>({
      method: 'GET',
      url: '/api/app/lesson',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount, filter: input.filter },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLessonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LessonDto>({
      method: 'PUT',
      url: `/api/app/lesson/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
