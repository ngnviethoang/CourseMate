import type { NotificationType } from '../../shared/notification-type.enum';

export interface NotificationDto {
  id?: string;
  userId?: string;
  type?: NotificationType;
  message?: string;
  data?: string;
  isRead: boolean;
  createdAt?: string;
  readAt?: string;
  expiredAt?: string;
  isActive: boolean;
}
