'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, Loader2, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/useNotifications'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'Vừa xong'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, loading, hasMore, loadMore, markAsRead, markAllAsRead } = useNotifications()

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setOpen(!open)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl border border-border/50 bg-popover shadow-2xl shadow-black/20 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Inbox className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              <>
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markAsRead(n.id)
                    }}
                    className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-accent/50 border-b border-border/30 last:border-b-0 ${
                      !n.isRead ? 'bg-primary/[0.03]' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    <div className="mt-1.5 shrink-0">
                      {!n.isRead ? (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.creationTime)}</p>
                    </div>

                    {/* Read check */}
                    {!n.isRead && (
                      <div className="shrink-0 mt-1">
                        <Check className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </div>
                    )}
                  </button>
                ))}

                {/* Load More */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full py-3 text-xs font-medium text-primary hover:bg-accent/50 transition-colors"
                  >
                    Xem thêm thông báo cũ hơn
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
