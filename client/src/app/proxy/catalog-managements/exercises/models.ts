import type { EntityDto } from '@abp/ng.core';
import type { DifficultyType } from '../../shared/difficulty-type.enum';
import type { TestCaseDto } from '../test-cases/models';

export interface CreateExerciseDto extends EntityDto {
  title?: string;
  userCode?: string;
  question?: string;
  constraints?: string;
  difficulty?: DifficultyType;
}

export interface ExerciseDto {
  id?: string;
  title?: string;
  userCode?: string;
  question?: string;
  constraints?: string;
  difficulty?: DifficultyType;
  testCases: TestCaseDto[];
}

export interface UpdateExerciseDto extends ExerciseDto {
}
