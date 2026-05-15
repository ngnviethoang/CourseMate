'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import { getAccessToken, getUserId } from '@/lib/auth-token.util'
import { notificationService, NotificationDto } from '@/lib/notification-service'
import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

interface UseNotificationsResult {
  notifications: NotificationDto[]
  unreadCount: number
  loading: boolean
  hasMore: boolean
  loadMore: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const connectionRef = useRef<HubConnection | null>(null)
  const PAGE_SIZE = 15

  const userId = typeof window !== 'undefined' ? getUserId() : null

  // Fetch initial data
  const fetchInitial = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [listResult, countResult] = await Promise.all([
        notificationService.getList(userId, 1, PAGE_SIZE),
        notificationService.getUnreadCount()
      ])
      setNotifications(listResult.items)
      setTotalCount(listResult.totalCount)
      setUnreadCount(countResult.count)
      setPageIndex(0)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Load more (pagination)
  const loadMore = useCallback(async () => {
    if (!userId) return
    const nextPage = pageIndex + 1
    try {
      const result = await notificationService.getList(userId, nextPage, PAGE_SIZE)
      setNotifications(prev => [...prev, ...result.items])
      setTotalCount(result.totalCount)
      setPageIndex(nextPage)
    } catch (err) {
      console.error('Failed to load more notifications:', err)
    }
  }, [userId, pageIndex])

  const hasMore = notifications.length < totalCount

  // Mark one as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }, [])

  // Set up SignalR connection
  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/notification?access_token=${token}`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = connection

    connection.on('ReceiveNotification', (notification: NotificationDto) => {
      // Prepend to list
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      setTotalCount(prev => prev + 1)

      // Show toast
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000
      })
    })

    connection.start().catch(err => console.error('Failed to connect to NotificationHub:', err))

    return () => {
      connection.stop().catch(() => { })
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchInitial()
  }, [fetchInitial])

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    refresh: fetchInitial
  }
}
