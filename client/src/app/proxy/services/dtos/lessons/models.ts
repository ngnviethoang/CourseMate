import type { AuditedEntityDto } from '@abp/ng.core';
import type { LessonType } from '../../../entities/lessons/lesson-type.enum';

export interface LessonDto extends AuditedEntityDto<string> {
  type?: LessonType;
  chapterId?: string;
  position: number;
  title?: string;
  content?: string;
  videoFile?: string;
  duration?: string;
  codeSampleJson?: string;
  optionsJson?: string;
  correctAnswerJson?: string;
  explanation?: string;
}

export interface CreateUpdateLessonDto {
  title?: string;
  content?: string;
  videoFile?: string;
  duration?: string;
  chapterId?: string;
  position: number;
}
