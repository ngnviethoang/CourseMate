import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CourseProgressDto, CreateUpdateUserProgressDto } from '../dtos/user-progresses/models';

@Injectable({
  providedIn: 'root',
})
export class UserProgressService {
  apiName = 'Default';
  

  createOrUpdate = (id: string, input: CreateUpdateUserProgressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/user-progress/${id}/or-update`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (courseId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CourseProgressDto>({
      method: 'GET',
      url: '/api/app/user-progress',
      params: { courseId },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
