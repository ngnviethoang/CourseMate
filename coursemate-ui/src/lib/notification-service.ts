import { api } from './api-client'

export interface NotificationDto {
  id: string
  receiverId: string
  title: string
  message: string
  isRead: boolean
  creationTime: string
}

export interface PagedNotifications {
  items: NotificationDto[]
  totalCount: number
  pageIndex: number
  pageSize: number
}

export const notificationService = {
  getList: (userId: string, pageIndex = 1, pageSize = 20) =>
    api.get<PagedNotifications>(`/api/notifications?UserId=${userId}&PageIndex=${pageIndex}&PageSize=${pageSize}`),

  getUnreadCount: () => api.get<{ count: number }>('/api/notifications/unread-count'),

  markAsRead: (id: string) => api.put<{ id: string }>(`/api/notifications/${id}/read`),

  markAllAsRead: () => api.put<{ count: number }>('/api/notifications/read-all')
}
