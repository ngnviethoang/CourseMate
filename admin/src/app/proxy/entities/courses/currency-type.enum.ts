import { mapEnumToOptions } from '@abp/ng.core';

export enum CurrencyType {
  Usd = 0,
  Vnd = 1,
}

export const currencyTypeOptions = mapEnumToOptions(CurrencyType);
