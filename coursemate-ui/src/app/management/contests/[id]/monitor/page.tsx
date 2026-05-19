'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Ban,
  RotateCcw,
  Users,
  AlertTriangle,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  MonitorX,
  CircleSlash,
  Undo2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService } from '@/lib/contest-service'
import { getAccessToken } from '@/lib/auth-token.util'
import { ViolationType } from '@/hooks/useAntiCheat'
import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

interface ViolationEntry {
  id: string
  violationType: ViolationType | string
  details?: string
  occurredAt: string
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
}

interface StudentViolation {
  studentId: string
  studentName: string
  violationCount: number
  isDisqualified: boolean
  disqualifiedAt?: string
  disqualifiedReason?: string
  violations: ViolationEntry[]
}

interface ContestViolations {
  contestId: string
  contestTitle: string
  students: StudentViolation[]
}

const VIOLATION_LABELS: Record<string, { label: string; color: string }> = {
  [ViolationType.TabSwitch]: { label: 'Chuyển tab', color: 'text-amber-400' },
  [ViolationType.WindowBlur]: { label: 'Mất focus', color: 'text-orange-400' },
  [ViolationType.CopyPaste]: { label: 'Paste nội dung', color: 'text-red-400' },
  [ViolationType.RightClick]: { label: 'Click chuột phải', color: 'text-yellow-400' },
  [ViolationType.DevToolsOpen]: { label: 'Mở DevTools', color: 'text-red-500' },
  [ViolationType.ScreenResize]: { label: 'Thay đổi kích thước', color: 'text-purple-400' }
}

function getStatusColor(student: StudentViolation) {
  if (student.isDisqualified) return 'bg-neutral-800 border-neutral-600'
  if (student.violationCount >= 5) return 'bg-red-500/5 border-red-500/20'
  if (student.violationCount >= 3) return 'bg-orange-500/5 border-orange-500/20'
  if (student.violationCount >= 1) return 'bg-amber-500/5 border-amber-500/20'
  return 'bg-emerald-500/5 border-emerald-500/20'
}

function getStatusIcon(student: StudentViolation) {
  if (student.isDisqualified) return <ShieldX className="h-5 w-5 text-neutral-500" />
  if (student.violationCount >= 5) return <ShieldAlert className="h-5 w-5 text-red-500" />
  if (student.violationCount >= 1) return <AlertTriangle className="h-5 w-5 text-amber-500" />
  return <ShieldCheck className="h-5 w-5 text-emerald-500" />
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function ContestMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<ContestViolations | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [dqReason, setDqReason] = useState('')
  const [dqConfirm, setDqConfirm] = useState<string | null>(null) // studentId being DQ'd
  const connectionRef = useRef<HubConnection | null>(null)

  const fetchData = useCallback(async () => {
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

    connection.on('StudentViolation', (event: any) => {
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
                violationType: event.violationType,
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
                violationType: event.violationType,
                occurredAt: event.timestamp,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
                deviceFingerprint: event.deviceFingerprint
              }
            ]
          })
        }
        return { ...prev, students }
      })

      toast.warning(`${event.studentName}: ${event.violationType} (${event.violationCount}/${event.maxViolations})`, {
        duration: 3000
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
      toast.error(`Sinh viên đã bị loại: ${event.reason}`)
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
    })

    connection
      .start()
      .then(() => connection.invoke('JoinContestMonitor', id))
      .catch(err => console.error('Failed to connect monitor:', err))

    return () => {
      connection.stop().catch(() => {})
    }
  }, [id])

  const handleDisqualify = async (studentId: string) => {
    if (!dqReason.trim()) {
      toast.error('Vui lòng nhập lý do loại')
      return
    }
    try {
      await contestService.disqualifyStudent(id, studentId, dqReason)
      toast.success('Đã loại sinh viên')
      setDqConfirm(null)
      setDqReason('')
      fetchData()
    } catch {
      toast.error('Không thể loại sinh viên')
    }
  }

  const handleReinstate = async (studentId: string) => {
    if (!confirm('Bạn có chắc muốn phục hồi sinh viên này?')) return
    try {
      await contestService.reinstateStudent(id, studentId)
      toast.success('Đã phục hồi sinh viên')
      fetchData()
    } catch {
      toast.error('Không thể phục hồi sinh viên')
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a12]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )

  const totalViolations = data?.students.reduce((sum, s) => sum + s.violationCount, 0) ?? 0
  const disqualifiedCount = data?.students.filter(s => s.isDisqualified).length ?? 0
  const flaggedCount = data?.students.filter(s => s.violationCount > 0 && !s.isDisqualified).length ?? 0

  // Calculate IP/Device Collisions for red flags
  const deviceMap = new Map<string, Set<string>>()
  const ipMap = new Map<string, Set<string>>()

  data?.students.forEach(student => {
    student.violations.forEach(v => {
      if (v.deviceFingerprint) {
        if (!deviceMap.has(v.deviceFingerprint)) deviceMap.set(v.deviceFingerprint, new Set())
        deviceMap.get(v.deviceFingerprint)!.add(student.studentId)
      }
      if (v.ipAddress) {
        if (!ipMap.has(v.ipAddress)) ipMap.set(v.ipAddress, new Set())
        ipMap.get(v.ipAddress)!.add(student.studentId)
      }
    })
  })

  const suspiciousStudents = new Set<string>()
  deviceMap.forEach((students, device) => {
    if (students.size > 1) {
      students.forEach(s => suspiciousStudents.add(s))
    }
  })
  ipMap.forEach((students, ip) => {
    if (students.size > 1) {
      students.forEach(s => suspiciousStudents.add(s))
    }
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100">
      {/* Header */}
      <header className="shadow-md border-0 border-b-0 -white/5 bg-[#12121a] px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/management/contests/${id}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-neutral-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Anti-Cheat Monitor
            </h1>
            <p className="text-xs text-neutral-500">{data?.contestTitle}</p>
          </div>
          <Button onClick={fetchData} variant="ghost" className="text-neutral-400 hover:text-white gap-2">
            <RefreshCw className="h-4 w-4" /> Làm mới
          </Button>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Real-time connected" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Tổng vi phạm',
              value: totalViolations,
              icon: AlertTriangle,
              color: 'text-amber-500',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
            {
              label: 'Đang gắn cờ',
              value: flaggedCount,
              icon: Eye,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10 border-orange-500/20'
            },
            {
              label: 'Đã loại',
              value: disqualifiedCount,
              icon: Ban,
              color: 'text-red-500',
              bg: 'bg-red-500/10 border-red-500/20'
            },
            {
              label: 'Sinh viên bình thường',
              value: (data?.students.length ?? 0) - flaggedCount - disqualifiedCount,
              icon: ShieldCheck,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10 border-emerald-500/20'
            }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl ${stat.bg}`}>
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Student List */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
            <Users className="h-4 w-4" /> Danh sách sinh viên ({data?.students.length ?? 0})
          </h2>

          {data?.students.length === 0 && (
            <div className="text-center py-16 text-neutral-600">
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Chưa có vi phạm nào được ghi nhận.</p>
            </div>
          )}

          {data?.students.map(student => {
            const isSuspicious = suspiciousStudents.has(student.studentId)

            // Extract unique IPs and Devices for this student
            const studentIps = Array.from(new Set(student.violations.map(v => v.ipAddress).filter(Boolean)))
            const studentDevices = Array.from(new Set(student.violations.map(v => v.deviceFingerprint).filter(Boolean)))

            return (
              <div
                key={student.studentId}
                className={`rounded-2xl transition-all ${getStatusColor(student)} ${isSuspicious ? 'ring-2 ring-red-500/50' : ''}`}
              >
                {/* Student Row */}
                <button
                  onClick={() => setExpandedStudent(expandedStudent === student.studentId ? null : student.studentId)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  {getStatusIcon(student)}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold text-sm flex items-center gap-2 ${student.isDisqualified ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}
                    >
                      {student.studentName}
                      {isSuspicious && !student.isDisqualified && (
                        <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                          <AlertTriangle className="h-3 w-3" /> Đa nghi
                        </span>
                      )}
                    </p>
                    {student.isDisqualified && (
                      <p className="text-[10px] text-red-400 mt-0.5">
                        Đã loại: {student.disqualifiedReason} •{' '}
                        {student.disqualifiedAt ? formatTime(student.disqualifiedAt) : ''}
                      </p>
                    )}
                    {!student.isDisqualified && (studentIps.length > 0 || studentDevices.length > 0) && (
                      <div className="flex gap-3 mt-1.5 opacity-60">
                        {studentIps.length > 0 && (
                          <span className="text-[10px] text-neutral-400">IP: {studentIps.join(', ')}</span>
                        )}
                        {studentDevices.length > 0 && (
                          <span className="text-[10px] text-neutral-400">Thiết bị: {studentDevices.length} máy</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black ${
                        student.isDisqualified
                          ? 'bg-neutral-700 text-neutral-400'
                          : student.violationCount >= 5
                            ? 'bg-red-500/20 text-red-400'
                            : student.violationCount >= 3
                              ? 'bg-orange-500/20 text-orange-400'
                              : student.violationCount >= 1
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {student.violationCount} vi phạm
                    </span>

                    {!student.isDisqualified ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs gap-1"
                        onClick={e => {
                          e.stopPropagation()
                          setDqConfirm(student.studentId)
                        }}
                      >
                        <CircleSlash className="h-3 w-3" /> Loại
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs gap-1"
                        onClick={e => {
                          e.stopPropagation()
                          handleReinstate(student.studentId)
                        }}
                      >
                        <Undo2 className="h-3 w-3" /> Phục hồi
                      </Button>
                    )}
                  </div>
                </button>

                {/* Expanded: Violation Timeline */}
                {expandedStudent === student.studentId && (
                  <div className="px-5 pb-5 shadow-md border-0 border-t-0 -white/5">
                    <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                      {student.violations.length === 0 ? (
                        <p className="text-xs text-neutral-600 text-center py-4">Không có chi tiết vi phạm</p>
                      ) : (
                        student.violations.map((v, i) => {
                          const info = VIOLATION_LABELS[v.violationType] || {
                            label: v.violationType,
                            color: 'text-neutral-400'
                          }
                          return (
                            <div
                              key={v.id || i}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors"
                            >
                              <div className={`w-2 h-2 rounded-full shrink-0 ${info.color.replace('text-', 'bg-')}`} />
                              <div className="flex-1 min-w-0">
                                <p className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${info.color}`}>{info.label}</span>
                                  <span className="text-xs text-neutral-600 truncate">{v.details}</span>
                                </p>
                                {(v.ipAddress || v.deviceFingerprint) && (
                                  <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-3">
                                    {v.ipAddress && <span>IP: {v.ipAddress}</span>}
                                    {v.deviceFingerprint && <span>Dev: {v.deviceFingerprint}</span>}
                                  </p>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                                {formatTime(v.occurredAt)}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* DQ Confirmation Modal */}
                {dqConfirm === student.studentId && (
                  <div className="px-5 pb-5 shadow-md border-0 border-t-0 -red-500/10">
                    <div className="mt-4 p-4 rounded-xl bg-red-500/5 -red-500/10 space-y-3">
                      <p className="text-xs font-bold text-red-400">Loại sinh viên: {student.studentName}</p>
                      <input
                        type="text"
                        placeholder="Nhập lý do loại..."
                        value={dqReason}
                        onChange={e => setDqReason(e.target.value)}
                        className="w-full px-3 py-2 bg-black/40 -white/10 rounded-lg text-sm text-neutral-200 outline-none focus:-red-500/50"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-500 text-white text-xs"
                          onClick={() => handleDisqualify(student.studentId)}
                        >
                          Xác nhận loại
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-neutral-400 text-xs"
                          onClick={() => {
                            setDqConfirm(null)
                            setDqReason('')
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
