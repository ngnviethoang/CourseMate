import type { BasketDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  apiName = 'Default';
  

  addItemsByCourseIds = (courseIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/basket/items',
      body: courseIds,
    },
    { apiName: this.apiName,...config });
  

  checkExitsInCartByCourseId = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/basket/check-exits-in-cart/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  deleteItemByCourseId = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/basket/item/${courseId}`,
    },
    { apiName: this.apiName,...config });
  

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BasketDto>({
      method: 'GET',
      url: '/api/app/basket',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
