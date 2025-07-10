import type { CreateTestCaseDto, TestCaseDto, UpdateTestCase } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestCaseService {
  apiName = 'Default';
  

  create = (input: UpdateTestCase, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TestCaseDto>({
      method: 'POST',
      url: '/api/app/test-case',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/test-case/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TestCaseDto>({
      method: 'GET',
      url: `/api/app/test-case/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CreateTestCaseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<TestCaseDto>>({
      method: 'GET',
      url: '/api/app/test-case',
      params: { exerciseId: input.exerciseId, input: input.input, expected: input.expected, output: input.output, passed: input.passed },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateTestCase, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TestCaseDto>({
      method: 'PUT',
      url: `/api/app/test-case/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
