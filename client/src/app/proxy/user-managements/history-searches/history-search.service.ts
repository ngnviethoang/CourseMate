import type { CreateHistorySearchDto, HistorySearchDto, UpdateHistorySearchDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistorySearchService {
  apiName = 'Default';
  

  create = (input: CreateHistorySearchDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HistorySearchDto>({
      method: 'POST',
      url: '/api/app/history-search',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/history-search/${id}`,
    },
    { apiName: this.apiName,...config });
  

  search = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HistorySearchDto[]>({
      method: 'POST',
      url: `/api/app/history-search/search/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateHistorySearchDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HistorySearchDto>({
      method: 'PUT',
      url: `/api/app/history-search/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
