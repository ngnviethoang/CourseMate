import type { CreateQuestionLessonDto, QuestionLessonDto, UpdateQuestionLessonDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionLessonService {
  apiName = 'Default';
  

  create = (input: CreateQuestionLessonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionLessonDto>({
      method: 'POST',
      url: '/api/app/question-lesson',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/question-lesson/${id}`,
    },
    { apiName: this.apiName,...config });
  

  findAll = (lessonId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionLessonDto[]>({
      method: 'POST',
      url: `/api/app/question-lesson/find-all-async-by-lesson-id/${lessonId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: UpdateQuestionLessonDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuestionLessonDto>({
      method: 'PUT',
      url: `/api/app/question-lesson/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
