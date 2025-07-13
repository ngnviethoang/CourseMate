import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdatePaymentRequestDto, PaymentRequestDto } from '../dtos/payment-requests/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentRequestService {
  apiName = 'Default';
  

  create = (input: CreateUpdatePaymentRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentRequestDto>({
      method: 'POST',
      url: '/api/app/payment-request',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/payment-request/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentRequestDto>({
      method: 'GET',
      url: `/api/app/payment-request/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PaymentRequestDto>>({
      method: 'GET',
      url: '/api/app/payment-request',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePaymentRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentRequestDto>({
      method: 'PUT',
      url: `/api/app/payment-request/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
