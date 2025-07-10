import type { ChapterDto, CreateChapterDto, GetListChapterRequestDto, UpdateChapterDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  apiName = 'Default';
  

  create = (input: CreateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChapterDto>({
      method: 'POST',
      url: '/api/app/chapter',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chapter/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChapterDto>({
      method: 'GET',
      url: `/api/app/chapter/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListChapterRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChapterDto>>({
      method: 'GET',
      url: '/api/app/chapter',
      params: { courseId: input.courseId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChapterDto>({
      method: 'PUT',
      url: `/api/app/chapter/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
