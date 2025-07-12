import { mapEnumToOptions } from '@abp/ng.core';

export enum NotificationType {
  Information = 0,
  Warning = 1,
  Danger = 2,
  Update = 3,
  Alert = 4,
  Reminder = 5,
}

export const notificationTypeOptions = mapEnumToOptions(NotificationType);
