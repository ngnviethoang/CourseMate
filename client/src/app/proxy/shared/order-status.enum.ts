import { mapEnumToOptions } from '@abp/ng.core';

export enum OrderStatus {
  Placed = 0,
  Paid = 1,
  Cancelled = 2,
}

export const orderStatusOptions = mapEnumToOptions(OrderStatus);
