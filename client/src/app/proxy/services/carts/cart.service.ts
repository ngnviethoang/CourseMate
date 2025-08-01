import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CartDto, CreateCartDto, GetListCartRequestDto } from '../dtos/carts/models';
import type { ResultObjectDto } from '../dtos/models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiName = 'Default';
  

  create = (input: CreateCartDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResultObjectDto>({
      method: 'POST',
      url: '/api/app/cart',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cart/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetListCartRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CartDto>>({
      method: 'GET',
      url: '/api/app/cart',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount, studentId: input.studentId },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
