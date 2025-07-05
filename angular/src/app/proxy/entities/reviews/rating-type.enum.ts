import { mapEnumToOptions } from '@abp/ng.core';

export enum RatingType {
  OneStar = 1,
  TwoStars = 2,
  ThreeStars = 3,
  FourStars = 4,
  FiveStars = 5,
}

export const ratingTypeOptions = mapEnumToOptions(RatingType);
