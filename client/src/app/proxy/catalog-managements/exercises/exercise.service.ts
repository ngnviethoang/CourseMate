import type { CreateExerciseDto, ExerciseDto, UpdateExerciseDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  apiName = 'Default';
  

  create = (input: UpdateExerciseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExerciseDto>({
      method: 'POST',
      url: '/api/app/exercise',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/exercise/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExerciseDto>({
      method: 'GET',
      url: `/api/app/exercise/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CreateExerciseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ExerciseDto>>({
      method: 'GET',
      url: '/api/app/exercise',
      params: { title: input.title, userCode: input.userCode, question: input.question, constraints: input.constraints, difficulty: input.difficulty },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateExerciseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ExerciseDto>({
      method: 'PUT',
      url: `/api/app/exercise/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
