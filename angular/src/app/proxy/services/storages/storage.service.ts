import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileDto } from '../dtos/storages/models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  apiName = 'Default';
  

  delete = (fileId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/storage',
      params: { fileId },
    },
    { apiName: this.apiName,...config });
  

  getImage = (fileId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'GET',
      responseType: 'blob',
      url: `/api/app/storage/image/${fileId}`,
    },
    { apiName: this.apiName,...config });
  

  streamVideo = (fileId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'POST',
      responseType: 'blob',
      url: `/api/app/storage/stream-video/${fileId}`,
    },
    { apiName: this.apiName,...config });
  

  uploadImage = (streamContent: FormData, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileDto>({
      method: 'POST',
      url: '/api/app/storage/upload-image',
      body: streamContent,
    },
    { apiName: this.apiName,...config });
  

  uploadVideo = (streamContent: FormData, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileDto>({
      method: 'POST',
      url: '/api/app/storage/upload-video',
      body: streamContent,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
