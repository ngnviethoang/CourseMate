import { mapEnumToOptions } from '@abp/ng.core';

export enum DifficultyType {
  Easy = 0,
  Normal = 1,
  Hard = 2,
}

export const difficultyTypeOptions = mapEnumToOptions(DifficultyType);
