import { mapEnumToOptions } from '@abp/ng.core';

export enum LanguageType {
  CSharp = 0,
  Java = 1,
  JavaScript = 2,
  CPlusPlus = 3,
}

export const languageTypeOptions = mapEnumToOptions(LanguageType);
