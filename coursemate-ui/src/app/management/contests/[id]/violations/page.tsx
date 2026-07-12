'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Ban,
  RotateCcw,
  Users,
  Search,
  Clock,
  Download,
  Filter,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Eye,
  Monitor,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService, ContestViolationsDto, StudentViolationSummaryDto } from '@/lib/contest-service'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getAccessToken } from '@/lib/auth-token.util'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

// ─── Violation type labels ────────────────────────────────────────────────────
const VIOLATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  TabSwitch: {
    label: 'Chuyển tab',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30'
  },
  WindowBlur: {
    label: 'Rời cửa sổ',
    color: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30'
  },
  CopyPaste: { label: 'Sao chép / Dán', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  RightClick: {
    label: 'Chuột phải',
    color: 'text-yellow-700 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  DevToolsOpen: {
    label: 'Mở DevTools',
    color: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/30'
  },
  ScreenResize: {
    label: 'Thay đổi kích thước',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30'
  }
}

// Maps integer enum value sent by backend SignalR to string name
const VIOLATION_TYPE_NAMES = [
  'TabSwitch',     // 0
  'WindowBlur',    // 1
  'CopyPaste',     // 2
  'RightClick',    // 3
  'DevToolsOpen',  // 4
  'ScreenResize',  // 5
  'MultipleMonitors', // 6
  'ExternalPaste'  // 7
]

/** Normalize violationType — backend may send an integer enum or a string */
function normalizeViolationType(raw: number | string): string {
  if (typeof raw === 'number') {
    return VIOLATION_TYPE_NAMES[raw] ?? String(raw)
  }
  return String(raw)
}

function getViolationMeta(type: string) {
  return VIOLATION_LABELS[type] ?? { label: type, color: 'text-muted-foreground', bg: 'bg-muted' }
}

function StatusBadge({ student }: { student: StudentViolationSummaryDto }) {
  if (student.isDisqualified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        <Ban className="h-3 w-3" /> Đã bị loại
      </span>
    )
  }
  if (student.violationCount >= 4) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
        <ShieldAlert className="h-3 w-3" /> Nguy hiểm
      </span>
    )
  }
  if (student.violationCount >= 2) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" /> Cảnh báo
      </span>
    )
  }
  if (student.violationCount >= 1) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        <AlertTriangle className="h-3 w-3" /> Theo dõi
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      <ShieldCheck className="h-3 w-3" /> Bình thường
    </span>
  )
}

export default function ContestViolationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [data, setData] = useState<ContestViolationsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'violated' | 'disqualified' | 'clean'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dqModal, setDqModal] = useState<{ studentId: string; studentName: string } | null>(null)
  const [dqReason, setDqReason] = useState('')
  const connectionRef = useRef<HubConnection | null>(null)
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await contestService.getViolations(id)
      setData(result)
    } catch {
      toast.error('Không thể tải dữ liệu vi phạm')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Real-time updates via SignalR
  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/contest?access_token=${token}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = connection

    connection.onreconnecting(() => setConnectionState('connecting'))
    connection.onreconnected(() => setConnectionState('connected'))
    connection.onclose(() => setConnectionState('disconnected'))

    connection.on('StudentViolation', (event: any) => {
      // Normalize violationType BEFORE storing — backend sends an integer enum via SignalR
      const violationType = normalizeViolationType(event.violationType)

      setData(prev => {
        if (!prev) return prev
        const students = [...prev.students]
        const idx = students.findIndex(s => s.studentId === event.studentId)

        if (idx >= 0) {
          students[idx] = {
            ...students[idx],
            violationCount: event.violationCount,
            isDisqualified: event.isDisqualified,
            violations: [
              {
                id: crypto.randomUUID(),
                violationType,
                occurredAt: event.timestamp,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
                deviceFingerprint: event.deviceFingerprint
              },
              ...students[idx].violations
            ]
          }
        } else {
          students.unshift({
            studentId: event.studentId,
            studentName: event.studentName,
            violationCount: event.violationCount,
            isDisqualified: event.isDisqualified,
            violations: [
              {
                id: crypto.randomUUID(),
                violationType,
                occurredAt: event.timestamp,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
                deviceFingerprint: event.deviceFingerprint
              }
            ]
          })
        }

        // Sort: most violations first
        students.sort((a, b) => b.violationCount - a.violationCount)

        return { ...prev, students }
      })

      const meta = VIOLATION_LABELS[violationType] ?? { label: violationType }

      toast.warning(`🚨 ${event.studentName}: ${meta.label} (${event.violationCount}/${event.maxViolations})`, {
        duration: 5000,
        action: {
          label: 'Xem',
          onClick: () => {
             setExpandedId(event.studentId)
             setTimeout(() => {
               document.getElementById(`student-row-${event.studentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
             }, 100)
          }
        }
      })
    })

    connection.on('StudentDisqualified', (event: any) => {
      setData(prev => {
        if (!prev) return prev
        const students = prev.students.map(s =>
          s.studentId === event.studentId
            ? { ...s, isDisqualified: true, disqualifiedAt: event.disqualifiedAt, disqualifiedReason: event.reason }
            : s
        )
        return { ...prev, students }
      })
      toast.error(`Sinh viên ${event.studentName || 'đã'} bị loại: ${event.reason}`)
    })

    connection.on('StudentReinstated', (event: any) => {
      setData(prev => {
        if (!prev) return prev
        const students = prev.students.map(s =>
          s.studentId === event.studentId
            ? { ...s, isDisqualified: false, disqualifiedAt: undefined, disqualifiedReason: undefined }
            : s
        )
        return { ...prev, students }
      })
      toast.success(`Sinh viên đã được phục hồi`)
    })

    connection
      .start()
      .then(() => {
        setConnectionState('connected')
        return connection.invoke('JoinContestMonitor', id)
      })
      .catch(err => {
        setConnectionState('disconnected')
        console.error('Failed to connect violations realtime:', err)
      })

    return () => {
      connection.stop().catch(() => {})
    }
  }, [id])

  // ── Derived data ────────────────────────────────────────────────────────────
  const students = data?.students ?? []

  const filtered = students
    .filter(s => s.studentName.toLowerCase().includes(search.toLowerCase()))
    .filter(s => {
      if (filter === 'violated') return s.violationCount > 0 && !s.isDisqualified
      if (filter === 'disqualified') return s.isDisqualified
      if (filter === 'clean') return s.violationCount === 0
      return true
    })

  const totalViolations = students.reduce((sum, s) => sum + s.violationCount, 0)
  const disqualifiedCount = students.filter(s => s.isDisqualified).length
  const violatedCount = students.filter(s => s.violationCount > 0 && !s.isDisqualified).length
  const cleanCount = students.filter(s => s.violationCount === 0).length

  // Most frequent violation types
  const typeCounts: Record<string, number> = {}
  students.forEach(s =>
    s.violations.forEach(v => {
      typeCounts[v.violationType] = (typeCounts[v.violationType] || 0) + 1
    })
  )
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleDisqualify = async () => {
    if (!dqModal || !dqReason.trim()) {
      toast.error('Vui lòng nhập lý do loại')
      return
    }
    setActionLoading(dqModal.studentId)
    try {
      if (connectionRef.current?.state === 'Connected') {
        await connectionRef.current.invoke('DisqualifyStudent', id, dqModal.studentId, dqReason)
      } else {
        await contestService.disqualifyStudent(id, dqModal.studentId, dqReason)
      }
      toast.success(`Đã loại ${dqModal.studentName}`)
      setDqModal(null)
      setDqReason('')
      fetchData()
    } catch {
      toast.error('Không thể loại sinh viên')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReinstate = async (studentId: string, studentName: string) => {
    if (!confirm(`Phục hồi ${studentName} tham gia cuộc thi?`)) return
    setActionLoading(studentId)
    try {
      if (connectionRef.current?.state === 'Connected') {
        await connectionRef.current.invoke('ReinstateStudent', id, studentId)
      } else {
        await contestService.reinstateStudent(id, studentId)
      }
      toast.success(`Đã phục hồi ${studentName}`)
      fetchData()
    } catch {
      toast.error('Không thể phục hồi')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!data) return
    const rows = [
      ['Họ tên', 'Số vi phạm', 'Trạng thái', 'Thời điểm bị loại', 'Lý do bị loại'],
      ...students.map(s => [
        s.studentName,
        s.violationCount,
        s.isDisqualified ? 'Đã bị loại' : s.violationCount > 0 ? 'Có vi phạm' : 'Bình thường',
        s.disqualifiedAt ? format(new Date(s.disqualifiedAt), 'dd/MM/yyyy HH:mm') : '',
        s.disqualifiedReason ?? ''
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `violations_${data.contestTitle}_${format(new Date(), 'yyyyMMdd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-500" />
                Đối soát vi phạm
              </h1>
              {data && <span className="text-sm text-muted-foreground font-medium">— {data.contestTitle}</span>}
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Kiểm tra, xét duyệt và xử lý các trường hợp vi phạm trong cuộc thi.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
                connectionState === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : connectionState === 'connecting'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionState === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : connectionState === 'connecting'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-red-500'
                }`}
              />
              {connectionState === 'connected'
                ? 'Realtime'
                : connectionState === 'connecting'
                  ? 'Đang kết nối...'
                  : 'Mất kết nối'}
            </div>
            <Link
              href={`/management/contests/${id}/monitor`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Monitor className="h-4 w-4 text-emerald-500" />
              Giám sát trực tiếp
            </Link>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-3.5 w-3.5" />
              Xuất CSV
            </Button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 grid-cols-4 gap-4">
          {[
            {
              label: 'Tổng thí sinh',
              value: students.length,
              icon: Users,
              color: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
              label: 'Có vi phạm',
              value: violatedCount,
              icon: AlertTriangle,
              color: 'text-amber-600 dark:text-amber-400',
              bg: 'bg-amber-50 dark:bg-amber-900/20'
            },
            {
              label: 'Đã bị loại',
              value: disqualifiedCount,
              icon: Ban,
              color: 'text-red-600 dark:text-red-400',
              bg: 'bg-red-50 dark:bg-red-900/20'
            },
            {
              label: 'Tổng lỗi ghi nhận',
              value: totalViolations,
              icon: Shield,
              color: 'text-purple-600 dark:text-purple-400',
              bg: 'bg-purple-50 dark:bg-purple-900/20'
            }
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-4 shadow-sm border border-border/50 flex items-center gap-4"
            >
              <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Top violations types ── */}
        {topTypes.length > 0 && (
          <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Info className="h-3.5 w-3.5" /> Loại vi phạm phổ biến nhất
            </p>
            <div className="grid grid-cols-2 grid-cols-4 gap-3">
              {topTypes.map(([type, count]) => {
                const meta = getViolationMeta(type)
                return (
                  <div key={type} className={`${meta.bg} rounded-lg p-3 flex items-center gap-3`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${meta.color}`}>{meta.label}</p>
                      <p className="text-xl font-black mt-0.5">{count}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="flex flex-col flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên sinh viên..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Tất cả', count: students.length },
            { key: 'violated', label: 'Vi phạm', count: violatedCount },
            { key: 'disqualified', label: 'Đã loại', count: disqualifiedCount },
            { key: 'clean', label: 'Bình thường', count: cleanCount }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border/50 hover:bg-muted text-muted-foreground'
              }`}
            >
              {f.label}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20' : 'bg-muted'}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Students table ── */}
      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <ShieldX className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Không tìm thấy kết quả phù hợp</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30">
              <span>Thí sinh</span>
              <span>Trạng thái</span>
              <span>Số vi phạm</span>
              <span>Thời điểm bị loại</span>
              <span>Thao tác</span>
            </div>

            {filtered.map(student => (
              <div key={student.studentId} id={`student-row-${student.studentId}`}>
                {/* ── Row ── */}
                <div className="px-6 py-4 grid grid-cols-1 grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center hover:bg-muted/20 transition-colors">
                  {/* Name + expand toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedId(expandedId === student.studentId ? null : student.studentId)}
                      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
                    >
                      {expandedId === student.studentId ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                        {student.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{student.studentName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{student.studentId.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge student={student} />
                  </div>

                  {/* Violation count progress */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-black ${student.violationCount >= 4 ? 'text-red-500' : student.violationCount >= 2 ? 'text-amber-500' : 'text-foreground'}`}
                    >
                      {student.violationCount}
                    </span>
                    <span className="text-xs text-muted-foreground">lỗi</span>
                  </div>

                  {/* DQ time */}
                  <div className="text-sm text-muted-foreground">
                    {student.isDisqualified && student.disqualifiedAt
                      ? format(new Date(student.disqualifiedAt), 'HH:mm dd/MM/yy', { locale: vi })
                      : '—'}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {student.isDisqualified ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        disabled={actionLoading === student.studentId}
                        onClick={() => handleReinstate(student.studentId, student.studentName)}
                      >
                        {actionLoading === student.studentId ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                        Phục hồi
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20"
                        disabled={actionLoading === student.studentId}
                        onClick={() => setDqModal({ studentId: student.studentId, studentName: student.studentName })}
                      >
                        <Ban className="h-3 w-3" />
                        Loại
                      </Button>
                    )}
                    <button
                      onClick={() => setExpandedId(expandedId === student.studentId ? null : student.studentId)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                      title="Xem chi tiết vi phạm"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* ── Expanded violation timeline ── */}
                {expandedId === student.studentId && (
                  <div className="px-6 pb-6 border-t border-border/30 bg-muted/10">
                    <div className="pt-4 space-y-3">
                      {/* DQ reason banner */}
                      {student.isDisqualified && student.disqualifiedReason && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-700 dark:text-red-400 mb-4">
                          <Ban className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1">Lý do bị loại</p>
                            <p className="text-sm">{student.disqualifiedReason}</p>
                            {student.disqualifiedAt && (
                              <p className="text-xs mt-1 opacity-70">
                                Lúc {format(new Date(student.disqualifiedAt), 'HH:mm:ss dd/MM/yyyy', { locale: vi })}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      {student.violations.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          Chưa có chi tiết vi phạm nào được ghi nhận.
                        </p>
                      ) : (
                        <>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
                            <Clock className="h-3 w-3" />
                            Lịch sử vi phạm ({student.violations.length} sự kiện)
                          </p>
                          <div className="relative pl-5 border-l-2 border-border space-y-4">
                            {student.violations.map((v, idx) => {
                              const meta = getViolationMeta(v.violationType)
                              return (
                                <div key={v.id} className="relative">
                                  <span
                                    className={`absolute -left-[21px] top-2 h-3 w-3 rounded-full ring-2 ring-background ${
                                      idx === 0 ? 'bg-red-500' : 'bg-border'
                                    }`}
                                  />
                                  <div className="bg-background rounded-xl border border-border/50 p-4 space-y-2">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.bg} ${meta.color}`}
                                      >
                                        {meta.label}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(v.occurredAt), 'HH:mm:ss — dd/MM/yyyy', { locale: vi })}
                                      </span>
                                    </div>
                                    {v.details && (
                                      <p className="text-xs text-muted-foreground break-all font-mono bg-muted/50 px-3 py-2 rounded-lg">
                                        {v.details}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Disqualify Modal ── */}
      {dqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Loại sinh viên</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Sinh viên <span className="font-semibold text-foreground">{dqModal.studentName}</span> sẽ bị loại khỏi
                  cuộc thi.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Lý do loại <span className="text-red-500">*</span>
              </label>
              <textarea
                value={dqReason}
                onChange={e => setDqReason(e.target.value)}
                placeholder="VD: Vi phạm quy chế thi — sử dụng tài liệu trái phép..."
                rows={3}
                className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDqModal(null)
                  setDqReason('')
                }}
              >
                Huỷ
              </Button>
              <Button
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                disabled={!dqReason.trim() || actionLoading === dqModal.studentId}
                onClick={handleDisqualify}
              >
                {actionLoading === dqModal.studentId && <Loader2 className="h-4 w-4 animate-spin" />}
                <Ban className="h-4 w-4" />
                Xác nhận loại
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
