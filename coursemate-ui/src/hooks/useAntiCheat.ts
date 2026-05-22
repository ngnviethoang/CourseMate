import { useEffect, useRef, useCallback, useState } from 'react'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import { getAccessToken } from '@/lib/auth-token.util'
import { toast } from 'sonner'

export enum ViolationType {
  TabSwitch = 'TabSwitch',
  WindowBlur = 'WindowBlur',
  CopyPaste = 'CopyPaste',
  RightClick = 'RightClick',
  DevToolsOpen = 'DevToolsOpen',
  ScreenResize = 'ScreenResize'
}

interface ViolationWarning {
  violationCount: number
  maxViolations: number
  message: string
}

interface ForceDisqualifyEvent {
  reason: string
}

interface UseAntiCheatOptions {
  contestId: string
  antiCheatLevel: 'None' | 'Basic' | 'Strict'
  maxViolations: number
  initialViolationCount?: number
  onDisqualified?: (reason: string) => void
}

export interface UseAntiCheatResult {
  violationCount: number
  isDisqualified: boolean
  connection: HubConnection | null
  lockedUntil: number | null
  lockoutReason: string
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
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [lockoutReason, setLockoutReason] = useState<string>('')

  const connectionRef = useRef<HubConnection | null>(null)
  const lastViolationTimeRef = useRef<Record<string, number>>({})
  const deviceFingerprintRef = useRef<string>('')
  const userAgentRef = useRef<string>('')

  // CRITICAL FIX: Reset and sync all states when contestId changes
  // This prevents leakage between different contests
  useEffect(() => {
    setViolationCount(initialViolationCount)
    setIsDisqualified(false)
    setLockedUntil(null)
    setLockoutReason('')
    lastViolationTimeRef.current = {}

    // Check for existing lockout for THIS specific contest
    if (typeof window !== 'undefined' && contestId) {
      const lockData = localStorage.getItem(`coursemate_lockout_${contestId}`)
      if (lockData) {
        try {
          const parsed = JSON.parse(lockData)
          if (parsed.lockedUntil > Date.now()) {
            setLockedUntil(parsed.lockedUntil)
            setLockoutReason(parsed.reason)
          } else {
            localStorage.removeItem(`coursemate_lockout_${contestId}`)
          }
        } catch {
          // ignore
        }
      }
    }
  }, [contestId, initialViolationCount])

  // Generate fingerprint once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      userAgentRef.current = navigator.userAgent
      const screenRes = `${window.screen.width}x${window.screen.height}`
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const lang = navigator.language
      const raw = `${userAgentRef.current}|${screenRes}|${tz}|${lang}`

      // Simple hash function
      let hash = 0
      for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash |= 0 // Convert to 32bit int
      }
      deviceFingerprintRef.current = `dev_${Math.abs(hash).toString(16)}`
    }
  }, [])

  // Clear lockout when time expires
  useEffect(() => {
    if (lockedUntil) {
      const remaining = lockedUntil - Date.now()
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setLockedUntil(null)
          setLockoutReason('')
          localStorage.removeItem(`coursemate_lockout_${contestId}`)
        }, remaining)
        return () => clearTimeout(timer)
      } else {
        setLockedUntil(null)
        setLockoutReason('')
        localStorage.removeItem(`coursemate_lockout_${contestId}`)
      }
    }
  }, [lockedUntil, contestId])

  // Report a violation via SignalR
  const reportViolation = useCallback(
    async (violationType: ViolationType | string, details?: string) => {
      if (isDisqualified || antiCheatLevel === 'None') return

      // Client-side throttle: 1 per type per 2 seconds
      const now = Date.now()
      const lastTime = lastViolationTimeRef.current[violationType] || 0
      if (now - lastTime < 2000) return
      lastViolationTimeRef.current[violationType] = now

      // Client-side immediate warning
      let userMessage = ''
      switch (violationType) {
        case ViolationType.TabSwitch:
        case ViolationType.WindowBlur:
          userMessage = '🚫 Cảnh báo: Vui lòng không chuyển tab hoặc rời khỏi màn hình thi!'
          break
        case ViolationType.CopyPaste:
          userMessage = '🚫 Không được phép dán (paste) nội dung trong khi thi!'
          break
        case ViolationType.RightClick:
          userMessage = '🚫 Không được phép sử dụng chuột phải!'
          break
        case ViolationType.DevToolsOpen:
        case ViolationType.ScreenResize:
          userMessage = '🚫 CẢNH BÁO: Không được phép sử dụng công cụ gian lận!'
          break
      }

      if (userMessage) {
        toast.error(userMessage, { id: violationType, duration: 4000 })
      }

      // Local Increment & Penalty Trigger
      setViolationCount(prev => {
        const newCount = prev + 1

        // Trigger Penalty Locally
        if (antiCheatLevel === 'Strict' || antiCheatLevel === 'Basic') {
          if (newCount === 3) {
            const lockTime = Date.now() + 60 * 1000 // 1 minute
            const reason = 'Vi phạm lần 3: Màn hình thi bị khóa tạm thời 1 phút.'
            setLockedUntil(lockTime)
            setLockoutReason(reason)
            localStorage.setItem(`coursemate_lockout_${contestId}`, JSON.stringify({ lockedUntil: lockTime, reason }))
          } else if (newCount === 4) {
            const lockTime = Date.now() + 180 * 1000 // 3 minutes
            const reason = 'Vi phạm lần 4: Màn hình thi bị khóa tạm thời 3 phút.'
            setLockedUntil(lockTime)
            setLockoutReason(reason)
            localStorage.setItem(`coursemate_lockout_${contestId}`, JSON.stringify({ lockedUntil: lockTime, reason }))
          } else if (newCount >= 5) {
            // Disqualify on 5th violation (or exceeding max)
            setIsDisqualified(true)
            setLockedUntil(null) // Clear penalty to show DQ overlay
            localStorage.removeItem(`coursemate_lockout_${contestId}`)
          }
        }
        return newCount
      })

      try {
        await connectionRef.current?.invoke('ReportViolation', {
          contestId,
          violationType,
          details,
          timestamp: new Date().toISOString(),
          userAgent: userAgentRef.current,
          deviceFingerprint: deviceFingerprintRef.current
        })
      } catch (err) {
        console.error('Failed to report violation:', err)
      }
    },
    [contestId, antiCheatLevel, isDisqualified, lockedUntil]
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
      // Sync with server if server count is higher
      setViolationCount(prev => Math.max(prev, data.violationCount))
      const remaining = data.maxViolations - data.violationCount

      if (remaining <= 2 && remaining > 0 && antiCheatLevel === 'Strict') {
        toast.error(
          `⚠️ Cảnh báo ${data.violationCount}/${data.maxViolations}: Còn ${remaining} lần vi phạm trước khi bị loại!`,
          { duration: 8000 }
        )
      } else {
        toast.warning(`⚠️ Thông báo vi phạm: ${data.message}`, { duration: 5000 })
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
    connection: connectionRef.current,
    lockedUntil,
    lockoutReason
  }
}
