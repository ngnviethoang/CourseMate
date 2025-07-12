import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BlobDto } from '../file-managements/models';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiName = 'Default';
  

  getBlobDocumentByFileName = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<BlobDto>>({
      method: 'GET',
      url: '/api/files/document',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  getBlobImageByFileName = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<BlobDto>>({
      method: 'GET',
      url: '/api/files/image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  streamingVideoByFileName = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'GET',
      url: '/api/files/video',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  uploadDocumentByFile = (file: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: '/api/files/document',
      body: file,
    },
    { apiName: this.apiName,...config });
  

  uploadImageByFile = (file: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: '/api/files/image',
      body: file,
    },
    { apiName: this.apiName,...config });
  

  uploadStreamingVideo = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult>({
      method: 'POST',
      url: '/api/files/video',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
