import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { LessonType } from '../../../entities/lessons/lesson-type.enum';
import type { LanguageType } from '../../../entities/lessons/language-type.enum';
import type { GetListRequestDto } from '../models';

export interface ArticleDto extends EntityDto<string> {
  lessonId?: string;
  content?: string;
}

export interface CodingExerciseDto extends EntityDto<string> {
  lessonId?: string;
  title?: string;
  description?: string;
  sampleCodes: SampleCodeDto[];
  testCases: TestCaseDto[];
}

export interface LessonDto extends AuditedEntityDto<string> {
  lessonType?: LessonType;
  chapterId?: string;
  position: number;
  title?: string;
  courseId?: string;
  article: ArticleDto;
  video: VideoDto;
  codingExercise: CodingExerciseDto;
  quizQuestion: QuizQuestionDto;
}

export interface QuizOptionDto extends EntityDto<string> {
  quizQuestionId?: string;
  text?: string;
  isCorrect: boolean;
}

export interface QuizQuestionDto extends EntityDto<string> {
  lessonId?: string;
  questionText?: string;
  quizOptions: QuizOptionDto[];
}

export interface SampleCodeDto extends EntityDto<string> {
  codingExerciseId?: string;
  code?: string;
  languageType?: LanguageType;
}

export interface TestCaseDto {
  codingExerciseId?: string;
  input?: string;
  output?: string;
  isHidden: boolean;
}

export interface VideoDto extends EntityDto<string> {
  lessonId?: string;
  videoFile?: string;
  duration?: string;
}

export interface CreateUpdateLessonDto {
  lessonType?: LessonType;
  chapterId?: string;
  position: number;
  title?: string;
  article: ArticleDto;
  video: VideoDto;
  codingExercise: CodingExerciseDto;
  quizQuestion: QuizQuestionDto;
}

export interface GetListLessonRequestDto extends GetListRequestDto {
  chapterId?: string;
}
