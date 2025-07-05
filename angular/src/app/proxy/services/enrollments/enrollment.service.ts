import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateEnrollmentDto, EnrollmentDto } from '../dtos/enrollments/models';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  apiName = 'Default';
  

  create = (input: CreateUpdateEnrollmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EnrollmentDto>({
      method: 'POST',
      url: '/api/app/enrollment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/enrollment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EnrollmentDto>({
      method: 'GET',
      url: `/api/app/enrollment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<EnrollmentDto>>({
      method: 'GET',
      url: '/api/app/enrollment',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateEnrollmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EnrollmentDto>({
      method: 'PUT',
      url: `/api/app/enrollment/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
