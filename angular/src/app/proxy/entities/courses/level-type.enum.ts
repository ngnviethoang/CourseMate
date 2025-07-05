import { mapEnumToOptions } from '@abp/ng.core';

export enum LevelType {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export const levelTypeOptions = mapEnumToOptions(LevelType);
