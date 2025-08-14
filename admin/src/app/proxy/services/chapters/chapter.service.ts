import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ChapterDto, CreateUpdateChapterDto, GetListChapterRequestDto } from '../dtos/chapters/models';
import type { ResultObjectDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResultObjectDto>({
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
      params: { courseId: input.courseId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount, filter: input.filter },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChapterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChapterDto>({
      method: 'PUT',
      url: `/api/app/chapter/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
