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

// ─── Lockout config: applied when server confirms violation count ─────────────
// These are UX-only deterrents. The authoritative DQ decision always comes from BE.
const LOCKOUT_CONFIG: Record<number, { durationMs: number; reason: string }> = {
  3: { durationMs: 60_000, reason: 'Vi phạm lần 3: Màn hình thi bị khóa tạm thời 1 phút.' },
  4: { durationMs: 180_000, reason: 'Vi phạm lần 4: Màn hình thi bị khóa tạm thời 3 phút.' }
}

// ─── Violation type → user-facing message ────────────────────────────────────
const VIOLATION_MESSAGES: Partial<Record<ViolationType, string>> = {
  [ViolationType.TabSwitch]: '🚫 Cảnh báo: Vui lòng không chuyển tab hoặc rời khỏi màn hình thi!',
  [ViolationType.WindowBlur]: '🚫 Cảnh báo: Vui lòng không rời khỏi màn hình thi!',
  [ViolationType.CopyPaste]: '🚫 Không được phép dán (paste) nội dung trong khi thi!',
  [ViolationType.RightClick]: '🚫 Không được phép sử dụng chuột phải!',
  [ViolationType.DevToolsOpen]: '🚫 CẢNH BÁO: Không được mở công cụ phát triển!',
  [ViolationType.ScreenResize]: '🚫 CẢNH BÁO: Không được thay đổi kích thước cửa sổ!'
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
  antiCheatLevel: 'None' | 'Basic' | 'Strict'
  maxViolations: number
  initialViolationCount?: number
  onDisqualified?: (reason: string) => void
}

export interface UseAntiCheatResult {
  /** Violation count synced FROM server (source of truth) */
  violationCount: number
  /** True only when server sends ForceDisqualify */
  isDisqualified: boolean
  /** SignalR connection instance */
  connection: HubConnection | null
  /** Reactive connection state */
  connectionState: 'connecting' | 'connected' | 'disconnected'
  /** Unix timestamp until screen is locked (UX deterrent, BE-triggered) */
  lockedUntil: number | null
  /** Reason message for lockout screen */
  lockoutReason: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export function useAntiCheat({
  contestId,
  antiCheatLevel,
  initialViolationCount = 0,
  onDisqualified
}: UseAntiCheatOptions): UseAntiCheatResult {
  // ── State (all driven by BE events, not local logic) ──────────────────────
  const [violationCount, setViolationCount] = useState(initialViolationCount)
  const [isDisqualified, setIsDisqualified] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [lockoutReason, setLockoutReason] = useState<string>('')
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [connection, setConnection] = useState<HubConnection | null>(null)

  // ── Refs ───────────────────────────────────────────────────────────────────
  const connectionRef = useRef<HubConnection | null>(null)
  const lastViolationTimeRef = useRef<Record<string, number>>({})
  const lockedUntilRef = useRef<number | null>(null) // for use inside callbacks
  const isDisqualifiedRef = useRef(false)
  const onDisqualifiedRef = useRef(onDisqualified)
  const deviceFingerprintRef = useRef<string>('')
  const userAgentRef = useRef<string>('')

  // Keep refs in sync with state
  useEffect(() => {
    lockedUntilRef.current = lockedUntil
  }, [lockedUntil])
  useEffect(() => {
    isDisqualifiedRef.current = isDisqualified
  }, [isDisqualified])
  useEffect(() => {
    onDisqualifiedRef.current = onDisqualified
  }, [onDisqualified])

  // ── Reset when contestId changes ───────────────────────────────────────────
  useEffect(() => {
    setViolationCount(initialViolationCount)
    setIsDisqualified(false)
    setLockedUntil(null)
    setLockoutReason('')
    lastViolationTimeRef.current = {}

    // Restore any active lockout stored in localStorage for this contest
    if (typeof window !== 'undefined' && contestId) {
      const stored = localStorage.getItem(`coursemate_lockout_${contestId}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.lockedUntil > Date.now()) {
            setLockedUntil(parsed.lockedUntil)
            setLockoutReason(parsed.reason)
          } else {
            localStorage.removeItem(`coursemate_lockout_${contestId}`)
          }
        } catch {
          /* ignore */
        }
      }
    }
  }, [contestId, initialViolationCount])

  // ── Auto-clear lockout when it expires ────────────────────────────────────
  useEffect(() => {
    if (!lockedUntil) return
    const remaining = lockedUntil - Date.now()
    if (remaining <= 0) {
      setLockedUntil(null)
      setLockoutReason('')
      localStorage.removeItem(`coursemate_lockout_${contestId}`)
      return
    }
    const timer = setTimeout(() => {
      setLockedUntil(null)
      setLockoutReason('')
      localStorage.removeItem(`coursemate_lockout_${contestId}`)
    }, remaining)
    return () => clearTimeout(timer)
  }, [lockedUntil, contestId])

  // ── Device fingerprint (generated once) ───────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    userAgentRef.current = navigator.userAgent
    const raw = [
      navigator.userAgent,
      `${window.screen.width}x${window.screen.height}`,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language
    ].join('|')
    let hash = 0
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i)
      hash |= 0
    }
    deviceFingerprintRef.current = `dev_${Math.abs(hash).toString(16)}`
  }, [])

  // ── Trigger lockout from a server-confirmed violation count ────────────────
  // This is a UX deterrent only — DQ authority stays with BE.
  const triggerLockoutIfNeeded = useCallback(
    (serverCount: number) => {
      const config = LOCKOUT_CONFIG[serverCount]
      if (!config) return
      const lockTime = Date.now() + config.durationMs
      setLockedUntil(lockTime)
      setLockoutReason(config.reason)
      localStorage.setItem(
        `coursemate_lockout_${contestId}`,
        JSON.stringify({ lockedUntil: lockTime, reason: config.reason })
      )
    },
    [contestId]
  )

  // ── Report violation to BE (the ONLY place state changes originate) ────────
  const reportViolation = useCallback(
    async (violationType: ViolationType | string, details?: string) => {
      // Guard: skip if already DQ'd or anti-cheat disabled
      if (isDisqualifiedRef.current || antiCheatLevel === 'None') return
      // Guard: skip while locked out (student is already penalized, no need to spam)
      if (lockedUntilRef.current && lockedUntilRef.current > Date.now()) return

      // Client-side throttle: deduplicate rapid same-type events (2s)
      const now = Date.now()
      const lastTime = lastViolationTimeRef.current[violationType] || 0
      if (now - lastTime < 2000) return
      lastViolationTimeRef.current[violationType] = now

      // Immediate UX toast (before server confirms — purely cosmetic)
      const message = VIOLATION_MESSAGES[violationType as ViolationType]
      if (message) toast.error(message, { duration: 4000 })

      // ── Send to backend via SignalR ────────────────────────────────────────
      // State updates happen exclusively inside ViolationWarning / ForceDisqualify handlers.
      const conn = connectionRef.current
      if (!conn || conn.state !== 'Connected') {
        // Connection not ready yet — skip silently (FE throttle will retry next time)
        console.warn(`[AntiCheat] Connection not ready (${conn?.state ?? 'null'}), skipping ${violationType}`)
        return
      }

      const VIOLATION_TYPE_MAP: Record<string, number> = {
        TabSwitch: 0,
        WindowBlur: 1,
        CopyPaste: 2,
        RightClick: 3,
        DevToolsOpen: 4,
        ScreenResize: 5,
        MultipleMonitors: 6,
        ExternalPaste: 7
      }
      const typeInt = typeof violationType === 'string' ? (VIOLATION_TYPE_MAP[violationType] ?? 0) : violationType;

      try {
        await conn.invoke('ReportViolation', {
          contestId,
          violationType: typeInt,
          details: details ?? '',
          timestamp: new Date().toISOString(),
          userAgent: userAgentRef.current,
          deviceFingerprint: deviceFingerprintRef.current
        })
      } catch (err) {
        console.error('[AntiCheat] Failed to report violation:', err)
      }
    },
    [contestId, antiCheatLevel]
    // ↑ No lockedUntil/isDisqualified in deps — using refs for those to avoid re-creating listeners
  )

  // ── SignalR connection ─────────────────────────────────────────────────────
  useEffect(() => {
    if (antiCheatLevel === 'None') return

    const token = getAccessToken()
    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/contest?access_token=${token}`)
      .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = connection
    setConnection(connection)

    // Track connection lifecycle for UI feedback
    connection.onreconnecting(() => setConnectionState('connecting'))
    connection.onreconnected(() => setConnectionState('connected'))
    connection.onclose(() => setConnectionState('disconnected'))

    // ── Server → Client events ─────────────────────────────────────────────

    /**
     * ViolationWarning: server confirmed the violation was logged.
     * This is the authoritative source for violationCount.
     * Also triggers lockout screen if configured for this count.
     */
    connection.on('ViolationWarning', (data: ViolationWarning) => {
      // Server count is the single source of truth
      setViolationCount(data.violationCount)

      // Trigger UX lockout based on server-confirmed count
      triggerLockoutIfNeeded(data.violationCount)

      // Show contextual warning to student
      const remaining = data.maxViolations - data.violationCount
      if (antiCheatLevel === 'Strict' && remaining > 0 && remaining <= 2) {
        toast.error(
          `⚠️ Vi phạm ${data.violationCount}/${data.maxViolations} — Còn ${remaining} lần trước khi bị loại!`,
          { duration: 8_000 }
        )
      } else if (data.message && !LOCKOUT_CONFIG[data.violationCount]) {
        // Only show generic message if no lockout popup is shown
        toast.warning(`⚠️ ${data.message}`, { duration: 5_000 })
      }
    })

    /**
     * ForceDisqualify: student is disqualified by auto-rule (Strict) or instructor.
     * This is the ONLY way isDisqualified becomes true.
     */
    connection.on('ForceDisqualify', (data: ForceDisqualifyEvent) => {
      setIsDisqualified(true)
      setLockedUntil(null) // clear lockout — DQ overlay takes over
      setLockoutReason('')
      localStorage.removeItem(`coursemate_lockout_${contestId}`)
      onDisqualifiedRef.current?.(data.reason)
    })

    /**
     * StudentReinstated: instructor undid the disqualification.
     */
    connection.on('StudentReinstated', () => {
      setIsDisqualified(false)
      toast.success('✅ Bạn đã được phục hồi — có thể tiếp tục làm bài.', { duration: 6_000 })
    })

    // Start + join group
    connection
      .start()
      .then(() => {
        setConnectionState('connected')
        return connection.invoke('JoinContest', contestId)
      })
      .catch(err => {
        setConnectionState('disconnected')
        // Ignore abort errors caused by React Strict Mode unmounting the component while connecting
        if (err.name === 'AbortError' || err.message?.includes('stopped during negotiation')) {
          console.log('[AntiCheat] SignalR connection cancelled (React Strict Mode unmount)')
        } else {
          console.error('[AntiCheat] SignalR connect failed:', err)
        }
      })

    return () => {
      connection.stop().catch(() => {})
      setConnection(null)
    }
  }, [contestId, antiCheatLevel, triggerLockoutIfNeeded])

  // ── Browser event monitors ─────────────────────────────────────────────────
  useEffect(() => {
    if (antiCheatLevel === 'None') return

    // 1. Tab Switch / Visibility Change
    const onVisibilityChange = () => {
      if (document.hidden) reportViolation(ViolationType.TabSwitch, 'Switched to another tab')
    }

    // 2. Window Blur (alt-tab, click outside browser)
    const onBlur = () => {
      // Delay to ensure document.hidden has time to update if the user is switching tabs
      setTimeout(() => {
        if (!document.hidden) {
          reportViolation(ViolationType.WindowBlur, 'Browser window lost focus')
        }
      }, 200)
    }

    // 3. Paste from clipboard
    const onPaste = (e: ClipboardEvent) => {
      const len = e.clipboardData?.getData('text')?.length ?? 0
      reportViolation(ViolationType.CopyPaste, `Pasted ${len} characters`)
    }

    // 4. Right-click context menu
    const onContextMenu = (e: MouseEvent) => {
      if (antiCheatLevel === 'Strict') e.preventDefault()
      toast.warning('🚫 Vui lòng hạn chế sử dụng chuột phải trong lúc thi!', { id: 'RightClickWarning' })
    }

    // 5. Significant window resize (likely devtools docked)
    let lastW = window.innerWidth
    let lastH = window.innerHeight
    const onResize = () => {
      const dw = Math.abs(window.innerWidth - lastW)
      const dh = Math.abs(window.innerHeight - lastH)
      if (dw > 200 || dh > 200) {
        reportViolation(ViolationType.ScreenResize, `${lastW}x${lastH} → ${window.innerWidth}x${window.innerHeight}`)
      }
      lastW = window.innerWidth
      lastH = window.innerHeight
    }

    // 6. DevTools detection by outer/inner dimension diff
    const DEV_TOOLS_THRESHOLD = 160
    const checkDevTools = () => {
      const dw = window.outerWidth - window.innerWidth
      const dh = window.outerHeight - window.innerHeight
      if (dw > DEV_TOOLS_THRESHOLD || dh > DEV_TOOLS_THRESHOLD) {
        reportViolation(ViolationType.DevToolsOpen, `diff w:${dw} h:${dh}`)
      }
    }
    const devToolsInterval = setInterval(checkDevTools, 3_000)

    // 7. Keyboard shortcuts (DevTools and Copy/Paste)
    const onKeydown = (e: KeyboardEvent) => {
      const isDevToolsShortcut =
        e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'u')
      if (isDevToolsShortcut) {
        if (antiCheatLevel === 'Strict') e.preventDefault()
        reportViolation(ViolationType.DevToolsOpen, `Shortcut: ${e.key}`)
        return
      }

      const isCopyPasteShortcut = (e.ctrlKey || e.metaKey) && ['c', 'v', 'C', 'V'].includes(e.key)
      if (isCopyPasteShortcut) {
        if (antiCheatLevel === 'Strict') e.preventDefault()
        reportViolation(ViolationType.CopyPaste, `Shortcut: Ctrl+${e.key.toUpperCase()}`)
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onBlur)
    document.addEventListener('paste', onPaste)
    document.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKeydown)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('paste', onPaste)
      document.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('keydown', onKeydown)
      clearInterval(devToolsInterval)
    }
  }, [antiCheatLevel, reportViolation])

  return {
    violationCount,
    isDisqualified,
    connection,
    connectionState,
    lockedUntil,
    lockoutReason
  }
}
