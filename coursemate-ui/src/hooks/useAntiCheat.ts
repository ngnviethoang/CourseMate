'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import { getAccessToken } from '@/lib/auth-token.util'
import { toast } from 'sonner'

type AntiCheatLevel = 'None' | 'Basic' | 'Strict'

// Must match backend CourseMate.Contracts.Enums.ViolationType
export enum ViolationType {
  TabSwitch = 'TabSwitch',
  WindowBlur = 'WindowBlur',
  CopyPaste = 'CopyPaste',
  RightClick = 'RightClick',
  DevToolsOpen = 'DevToolsOpen',
  ScreenResize = 'ScreenResize',
  MultipleMonitors = 'MultipleMonitors',
  ExternalPaste = 'ExternalPaste'
}

interface ViolationWarning {
  violationCount: number
  maxViolations: number
  message: string
}

interface ForceDisqualifyEvent {
  reason: string
  disqualifiedAt: string
}

interface UseAntiCheatOptions {
  contestId: string
  antiCheatLevel: AntiCheatLevel
  maxViolations: number
  initialViolationCount?: number
  onDisqualified?: (reason: string) => void
}

interface UseAntiCheatResult {
  violationCount: number
  isDisqualified: boolean
  connection: HubConnection | null
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export function useAntiCheat({
  contestId,
  antiCheatLevel,
  maxViolations,
  initialViolationCount = 0,
  onDisqualified
}: UseAntiCheatOptions): UseAntiCheatResult {
  const [violationCount, setViolationCount] = useState(initialViolationCount)
  const [isDisqualified, setIsDisqualified] = useState(false)
  const connectionRef = useRef<HubConnection | null>(null)
  const lastViolationTimeRef = useRef<Record<string, number>>({})

  // Report a violation via SignalR
  const reportViolation = useCallback(
    async (violationType: ViolationType, details?: string) => {
      if (isDisqualified || antiCheatLevel === 'None') return

      // Client-side throttle: 1 per type per 2 seconds
      const now = Date.now()
      const lastTime = lastViolationTimeRef.current[violationType] || 0
      if (now - lastTime < 2000) return
      lastViolationTimeRef.current[violationType] = now

      try {
        await connectionRef.current?.invoke('ReportViolation', {
          contestId,
          violationType,
          details,
          timestamp: new Date().toISOString()
        })
      } catch (err) {
        console.error('Failed to report violation:', err)
      }
    },
    [contestId, antiCheatLevel, isDisqualified]
  )

  // Set up SignalR connection
  useEffect(() => {
    if (antiCheatLevel === 'None') return

    const token = getAccessToken()
    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/contest?access_token=${token}`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = connection

    // Handle server events
    connection.on('ViolationWarning', (data: ViolationWarning) => {
      setViolationCount(data.violationCount)
      const remaining = data.maxViolations - data.violationCount

      if (antiCheatLevel === 'Strict' && remaining <= 2 && remaining > 0) {
        toast.error(
          `⚠️ Cảnh báo ${data.violationCount}/${data.maxViolations}: Còn ${remaining} lần vi phạm trước khi bị loại!`,
          {
            duration: 8000
          }
        )
      } else {
        toast.warning(`⚠️ Vi phạm ${data.violationCount}/${data.maxViolations}: ${data.message}`, {
          duration: 5000
        })
      }
    })

    connection.on('ForceDisqualify', (data: ForceDisqualifyEvent) => {
      setIsDisqualified(true)
      onDisqualified?.(data.reason)
    })

    connection.on('StudentReinstated', () => {
      setIsDisqualified(false)
      toast.success('Bạn đã được phục hồi tham gia cuộc thi.', { duration: 5000 })
    })

    // Start connection and join contest group
    connection
      .start()
      .then(() => connection.invoke('JoinContest', contestId))
      .catch(err => console.error('Failed to connect to ContestHub:', err))

    return () => {
      connection.stop().catch(() => {})
    }
  }, [contestId, antiCheatLevel, onDisqualified])

  // Set up browser event monitors
  useEffect(() => {
    if (antiCheatLevel === 'None') return

    // 1. Tab Switch / Visibility Change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation(ViolationType.TabSwitch, 'Student switched to another tab')
      }
    }

    // 2. Window Blur
    const handleBlur = () => {
      reportViolation(ViolationType.WindowBlur, 'Browser window lost focus')
    }

    // 3. Copy-Paste Detection
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || ''
      reportViolation(ViolationType.CopyPaste, `Pasted ${pastedText.length} characters`)
    }

    // 4. Right-Click / Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      if (antiCheatLevel === 'Strict') {
        e.preventDefault()
      }
      reportViolation(ViolationType.RightClick, 'Context menu opened')
    }

    // 5. Screen Resize (suspicious resize)
    let lastWidth = window.innerWidth
    let lastHeight = window.innerHeight
    const handleResize = () => {
      const widthDiff = Math.abs(window.innerWidth - lastWidth)
      const heightDiff = Math.abs(window.innerHeight - lastHeight)
      // Only report significant resizes (likely devtools or screen changes)
      if (widthDiff > 200 || heightDiff > 200) {
        reportViolation(
          ViolationType.ScreenResize,
          `Resize from ${lastWidth}x${lastHeight} to ${window.innerWidth}x${window.innerHeight}`
        )
      }
      lastWidth = window.innerWidth
      lastHeight = window.innerHeight
    }

    // 6. DevTools Detection
    const devToolsThreshold = 160
    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      if (widthDiff > devToolsThreshold || heightDiff > devToolsThreshold) {
        reportViolation(ViolationType.DevToolsOpen, `Width diff: ${widthDiff}, Height diff: ${heightDiff}`)
      }
    }
    const devToolsInterval = setInterval(checkDevTools, 3000)

    // 7. Keyboard shortcuts for devtools
    const handleKeydown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        if (antiCheatLevel === 'Strict') {
          e.preventDefault()
        }
        reportViolation(ViolationType.DevToolsOpen, `Keyboard shortcut: ${e.key}`)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeydown)
      clearInterval(devToolsInterval)
    }
  }, [antiCheatLevel, reportViolation])

  return {
    violationCount,
    isDisqualified,
    connection: connectionRef.current
  }
}
