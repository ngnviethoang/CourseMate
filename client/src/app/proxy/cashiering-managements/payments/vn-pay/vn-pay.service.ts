import type { ReturnUrlDto, VnPayResponseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VnPayService {
  apiName = 'Default';
  

  createUrlByOrderIdAndClientIp = (orderId: string, clientIp: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: `/api/app/vn-pay/url/${orderId}`,
      params: { clientIp },
    },
    { apiName: this.apiName,...config });
  

  returnUrlByInput = (input: ReturnUrlDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, VnPayResponseDto>({
      method: 'POST',
      url: '/api/app/vn-pay/return-url',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
