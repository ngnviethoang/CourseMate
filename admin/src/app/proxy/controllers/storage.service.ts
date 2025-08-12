import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileStreamResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  apiName = 'Default';
  

  getVideoByFileName = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileStreamResult>({
      method: 'GET',
      url: '/api/app/storage/video',
      params: { fileName },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
