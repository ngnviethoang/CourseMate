import { mapEnumToOptions } from '@abp/ng.core';

export enum LessonType {
  Video = 0,
  Document = 1,
  Quiz = 2,
  Coding = 3,
}

export const lessonTypeOptions = mapEnumToOptions(LessonType);
