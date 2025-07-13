import type { AuditedEntityDto } from '@abp/ng.core';

export interface NotificationDto extends AuditedEntityDto<string> {
  receiverUserId?: string;
  title?: string;
  content?: string;
  isRead: boolean;
}
