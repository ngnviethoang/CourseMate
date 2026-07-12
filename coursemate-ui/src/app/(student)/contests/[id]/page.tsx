'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Trophy,
  Clock,
  Users,
  Calendar,
  Star,
  Flame,
  Medal,
  ChevronRight,
  CheckCircle2,
  Code2,
  Loader2,
  Shield,
  AlertTriangle,
  Layout,
  List,
  X,
  Crown,
  Gift,
  BookOpen
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { contestService, ContestDto, ContestLeaderboardDto, StudentViolationSummaryDto } from '@/lib/contest-service'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'

const STATUS_LABEL: Record<string, string> = {
  Ongoing: 'Đang diễn ra',
  Upcoming: 'Sắp diễn ra',
  Ended: 'Đã kết thúc',
  Cancelled: 'Đã hủy'
}

const STATUS_COLOR: Record<string, string> = {
  Ongoing: 'bg-emerald-500',
  Upcoming: 'bg-blue-500',
  Ended: 'bg-muted-foreground',
  Cancelled: 'bg-red-500'
}

const ANTI_CHEAT_LABEL: Record<string, string> = {
  None: 'Không bật',
  Basic: 'Cơ bản',
  Strict: 'Nghiêm ngặt'
}

const RANK_MEDAL: Record<number, string> = { 1: 'text-amber-400', 2: 'text-slate-400', 3: 'text-amber-600' }
const RANK_BG: Record<number, string> = {
  1: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20',
  2: 'bg-gradient-to-r from-slate-400/10 to-slate-300/5 border border-slate-400/20',
  3: 'bg-gradient-to-r from-amber-700/10 to-amber-600/5 border border-amber-700/20'
}

// ─── Leaderboard Modal ────────────────────────────────────────────────────────

function LeaderboardModal({
  open,
  onClose,
  leaderboard,
  loading
}: {
  open: boolean
  onClose: () => void
  leaderboard: ContestLeaderboardDto | null
  loading: boolean
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 mb-0 sm:mb-0 rounded-t-3xl sm:rounded-3xl bg-card border border-white/10 shadow-2xl overflow-hidden"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Bảng xếp hạng</h2>
              <p className="text-xs text-muted-foreground font-medium">Kết quả thi thời gian thực</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(85vh - 100px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-amber-400/50" />
              <p className="text-muted-foreground font-medium text-sm">Đang tải bảng xếp hạng...</p>
            </div>
          ) : !leaderboard || leaderboard.entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Trophy className="h-16 w-16 text-muted-foreground/20" />
              <p className="text-muted-foreground font-medium">Chưa có lượt nộp bài nào được ghi nhận.</p>
              <p className="text-xs text-muted-foreground/60 italic">Dữ liệu sẽ cập nhật khi có thí sinh nộp bài.</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {leaderboard.entries.slice(0, 3).length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4 px-2">
                  {[1, 0, 2].map(idx => {
                    const entry = leaderboard.entries[idx]
                    if (!entry) return <div key={idx} />
                    const rank = entry.rank
                    const medalColors: Record<number, string> = { 1: 'text-amber-400', 2: 'text-slate-400', 3: 'text-amber-600' }
                    const bgColors: Record<number, string> = {
                      1: 'from-amber-500/20 to-yellow-500/10 border-amber-400/30',
                      2: 'from-slate-400/15 to-slate-300/5 border-slate-400/20',
                      3: 'from-amber-700/15 to-amber-600/5 border-amber-700/20'
                    }
                    const heights: Record<number, string> = { 1: 'pt-2', 2: 'pt-6', 3: 'pt-8' }
                    return (
                      <div key={idx} className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-b border ${bgColors[rank]} ${heights[rank]}`}>
                        <Medal className={`h-6 w-6 ${medalColors[rank]}`} />
                        <p className="text-xs font-black text-center truncate w-full text-center">{entry.studentName}</p>
                        <p className={`text-xl font-black ${rank === 1 ? 'text-amber-400' : 'text-foreground'}`}>{entry.totalScore}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">điểm</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Full list */}
              <div className="space-y-2">
                {leaderboard.entries.map(entry => (
                  <div
                    key={entry.studentId}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${RANK_BG[entry.rank] || 'bg-muted/30'}`}
                  >
                    <div className="w-8 text-center shrink-0">
                      {entry.rank <= 3 ? (
                        <Medal className={`h-6 w-6 mx-auto ${RANK_MEDAL[entry.rank]}`} />
                      ) : (
                        <span className="text-muted-foreground/40 font-black text-lg">{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{entry.studentName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.totalRuntime.toFixed(2)}s • {format(new Date(entry.lastSubmitTime), 'HH:mm:ss')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black text-primary">{entry.totalScore}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">điểm</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [contest, setContest] = useState<ContestDto | null>(null)
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboardDto | null>(null)
  const [myViolations, setMyViolations] = useState<StudentViolationSummaryDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [tab, setTab] = useState<'overview' | 'exercises' | 'leaderboard' | 'rules' | 'violations'>('overview')
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [leaderboardModalLoading, setLeaderboardModalLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await contestService.getById(id)
      setContest(data)
    } catch {
      toast.error('Không thể tải thông tin cuộc thi')
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchLeaderboard = useCallback(async () => {
    try {
      const lb = await contestService.getLeaderboard(id)
      setLeaderboard(lb)
    } catch (err) {
      console.error('Failed to fetch leaderboard', err)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Fetch leaderboard only when that tab is active
  useEffect(() => {
    if (tab === 'leaderboard') {
      fetchLeaderboard()
    } else if (tab === 'violations') {
      contestService.getMyViolations(id).then(setMyViolations).catch(console.error)
    }
  }, [tab, fetchLeaderboard, id])

  const handleOpenLeaderboardModal = async () => {
    setShowLeaderboardModal(true)
    if (!leaderboard) {
      setLeaderboardModalLoading(true)
      try {
        const lb = await contestService.getLeaderboard(id)
        setLeaderboard(lb)
      } catch {
        toast.error('Không thể tải bảng xếp hạng')
      } finally {
        setLeaderboardModalLoading(false)
      }
    }
  }

  const handleRegister = async () => {
    setRegistering(true)
    try {
      await contestService.register(id)
      toast.success('Đăng ký thành công!')
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setRegistering(false)
    }
  }

  const handleJoin = async () => {
    try {
      await contestService.checkIn(id)
      router.push(`/contests/${id}/arena`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể vào phòng thi')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="mx-4 mt-6 h-64 rounded-[2rem] border border-border/60 bg-muted" />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="h-10 w-2/3 rounded-full bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-24 rounded-2xl bg-muted" />
              <div className="h-24 rounded-2xl bg-muted" />
              <div className="h-40 rounded-3xl bg-muted" />
            </div>
            <div className="space-y-8">
              <div className="h-48 rounded-3xl bg-muted" />
              <div className="h-28 rounded-3xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )

  if (!contest)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Trophy className="h-12 w-12 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground">Không tìm thấy cuộc thi.</p>
        <Link href="/contests" className={buttonVariants({ variant: 'outline' })}>
          ← Quay lại
        </Link>
      </div>
    )

  const exercises = contest.exercises || []

  return (
    <div className="min-h-screen bg-background">
      {/* Leaderboard Modal */}
      <LeaderboardModal
        open={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        leaderboard={leaderboard}
        loading={leaderboardModalLoading}
      />

      {/* Header Section */}
      <div className="shadow-md border-0 border-b-0 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 px-6 px-8">
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>

          <div className="flex flex-col flex-row items-end justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider ${STATUS_COLOR[contest.status]}`}
                >
                  {STATUS_LABEL[contest.status]}
                </span>
                {contest.antiCheatLevel !== 'None' && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Chống gian lận:{' '}
                    {ANTI_CHEAT_LABEL[contest.antiCheatLevel] ?? contest.antiCheatLevel}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight">{contest.title}</h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary/60" />
                  {contest.startTime
                    ? format(new Date(contest.startTime), 'EEEE, dd MMMM HH:mm', { locale: vi })
                    : 'Sẽ thông báo'}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary/60" />
                  {contest.durationInMinutes} phút làm bài
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary/60" />
                  {contest.participantCount} người tham gia
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3">
              {contest.status === 'Ongoing' ? (
                contest.isRegistered ? (
                  contest.hasSubmitted ? (
                    <Button onClick={handleOpenLeaderboardModal} variant="outline" className="gap-2">
                      <Trophy className="h-4 w-4" /> Đã nộp bài — Xem xếp hạng
                    </Button>
                  ) : (
                    <Button onClick={handleJoin} className="gap-2">
                      <Flame className="h-4 w-4" /> Vào phòng thi
                    </Button>
                  )
                ) : (
                  <Button onClick={handleRegister} disabled={registering} className="gap-2">
                    {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                    Đăng ký &amp; Thi ngay
                  </Button>
                )
              ) : contest.status === 'Upcoming' ? (
                <Button
                  onClick={handleRegister}
                  disabled={registering || contest.isRegistered}
                  variant={contest.isRegistered ? 'outline' : 'default'}
                >
                  {contest.isRegistered ? '✓ Đã đăng ký' : 'Đăng ký tham dự'}
                </Button>
              ) : (
                <Button onClick={handleOpenLeaderboardModal} variant="secondary" className="gap-2">
                  <Trophy className="h-4 w-4" /> Xem kết quả cuối cùng
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      {contest.prizes && contest.prizes.length > 0 && (
        <div className="border-b border-border/50 bg-gradient-to-r from-amber-500/5 via-yellow-500/3 to-transparent">
          <div className="mx-auto max-w-5xl px-4 py-8 px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Gift className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-base font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Giải thưởng
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {contest.prizes.map(prize => {
                const rankConfig: Record<number, { label: string; border: string; medalColor: string; textColor: string }> = {
                  1: { label: 'Giải Nhất 🥇', border: 'from-amber-500/20 to-yellow-500/10 border-amber-400/40', medalColor: 'text-amber-400', textColor: 'text-amber-500' },
                  2: { label: 'Giải Nhì 🥈', border: 'from-slate-400/15 to-slate-300/5 border-slate-400/30', medalColor: 'text-slate-400', textColor: 'text-slate-400' },
                  3: { label: 'Giải Ba 🥉', border: 'from-amber-700/15 to-amber-600/5 border-amber-700/30', medalColor: 'text-amber-600', textColor: 'text-amber-600' },
                }
                const cfg = (prize.minRank === prize.maxRank && rankConfig[prize.minRank]) ? rankConfig[prize.minRank] : {
                  label: prize.minRank === prize.maxRank ? `Top ${prize.minRank}` : `Top ${prize.minRank} - ${prize.maxRank}`,
                  border: 'from-primary/10 to-primary/5 border-primary/20',
                  medalColor: 'text-primary',
                  textColor: 'text-primary'
                }
                return (
                  <div
                    key={prize.id}
                    className={`rounded-2xl bg-gradient-to-br border p-4 space-y-3 overflow-hidden`}
                    style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className={`text-xs font-black uppercase tracking-widest ${cfg.textColor}`}>{cfg.label}</div>
                    {prize.courseImageUrl && (
                      <img
                        src={prize.courseImageUrl}
                        alt={prize.courseTitle}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                    )}
                    <div>
                      <p className="font-bold text-sm leading-snug">{prize.courseTitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">bởi {prize.courseInstructorName}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-xs font-bold text-emerald-500">
                        {prize.coursePrice > 0 ? `Trị giá ${prize.coursePrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">Khóa học</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="mx-auto max-w-5xl px-4 py-10 px-6 px-8">
        <div className="flex gap-8 shadow-md border-0 border-b-0 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Tổng quan', icon: Layout },
            { id: 'exercises', label: `Bài tập (${exercises.length})`, icon: List },
            { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
            { id: 'rules', label: 'Thể lệ & Hướng dẫn', icon: CheckCircle2 },
            ...(contest.antiCheatLevel !== 'None' ? [{ id: 'violations', label: 'Lịch sử vi phạm', icon: Shield }] : [])
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold shadow-md border-0 border-b-0-2 transition-all whitespace-nowrap ${tab === t.id ? '-primary text-primary' : '-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="col-span-2">
            {tab === 'overview' && (
              <div className="space-y-8">
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                    {contest.description}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-blue-50 -blue-100 dark:bg-blue-500/5 dark:-blue-500/20 space-y-4">
                  <h3 className="font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> Thông tin kỹ thuật
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20">
                      <p className="text-muted-foreground mb-1">Ngôn ngữ</p>
                      <p className="font-bold">{contest.allowedLanguages || 'Tất cả'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20">
                      <p className="text-muted-foreground mb-1">Thời gian giới hạn</p>
                      <p className="font-bold">{contest.timeLimit} ms / bài</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'exercises' && (
              <div className="space-y-4">
                {exercises.length === 0 ? (
                  <div className="text-center py-20 -2 -dashed rounded-3xl">
                    <List className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Danh sách bài tập sẽ sớm được cập nhật.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {exercises.map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-card shadow-md border-0 hover:-primary/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{ex.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ex.scoreWeight} điểm • {ex.isPassed ? 'Đã hoàn thành' : 'Chưa giải'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleJoin}
                          className="rounded-xl gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Làm bài <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'leaderboard' && (
              <div className="space-y-4">
                {!leaderboard ? (
                  <div className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Đang tải bảng xếp hạng...</p>
                  </div>
                ) : leaderboard.entries.length === 0 ? (
                  <div className="text-center py-20 -2 -dashed rounded-3xl">
                    <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Chưa có lượt nộp bài nào được ghi nhận.</p>
                    <p className="text-xs text-muted-foreground/60 mt-1 italic">
                      Dữ liệu sẽ được cập nhật ngay khi có thí sinh nộp bài.
                    </p>
                  </div>
                ) : (
                  leaderboard.entries.map(entry => (
                    <div
                      key={entry.studentId}
                      className={`flex items-center gap-6 p-4 rounded-3xl transition-all ${entry.rank <= 3 ? 'bg-amber-50/50 -amber-200' : 'bg-card'}`}
                    >
                      <div className="w-10 text-center font-black text-xl italic">
                        {entry.rank <= 3 ? (
                          <Medal className={`h-8 w-8 mx-auto ${RANK_MEDAL[entry.rank]}`} />
                        ) : (
                          <span className="text-muted-foreground/40">{entry.rank}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg">{entry.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalRuntime.toFixed(2)}s thời gian chạy •{' '}
                          {format(new Date(entry.lastSubmitTime), 'HH:mm:ss')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">{entry.totalScore}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Điểm</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'rules' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    'Sử dụng các ngôn ngữ lập trình được cho phép.',
                    'Hệ thống chống gian lận sẽ theo dõi các hành vi bất thường (chuyển tab, sao chép mã).',
                    'Bài làm được chấm tự động dựa trên các bộ kiểm thử mẫu và ẩn.',
                    'Thứ hạng dựa trên Tổng điểm > Thời gian chạy > Thời gian nộp bài.',
                    'Mọi hành vi gian lận sẽ dẫn đến việc bị huỷ kết quả thi ngay lập tức.'
                  ].map((rule, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-sm font-medium leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'violations' && (
              <div className="space-y-6">
                <div className="bg-card rounded-3xl p-8 shadow-md border-0 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center -red-200">
                      <Shield className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Lịch sử vi phạm của bạn</h3>
                      <p className="text-muted-foreground mt-1">
                        Tổng số lỗi đã ghi nhận:{' '}
                        <span className="font-bold text-foreground">{myViolations?.violationCount || 0}</span>
                      </p>
                    </div>
                  </div>

                  {myViolations?.isDisqualified && (
                    <div className="p-4 rounded-2xl bg-red-50 -red-200 dark:bg-red-500/10 dark:-red-500/20 text-red-700 dark:text-red-400 font-medium">
                      <AlertTriangle className="h-5 w-5 inline mr-2" />
                      Bạn đã bị loại khỏi cuộc thi này do vi phạm quy chế. Lý do:{' '}
                      {myViolations.disqualifiedReason || 'Không rõ'}
                    </div>
                  )}

                  <div className="space-y-4 mt-6">
                    {!myViolations || myViolations.violations.length === 0 ? (
                      <p className="text-muted-foreground text-center py-10">
                        Bạn chưa có vi phạm nào. Hãy tiếp tục phát huy!
                      </p>
                    ) : (
                      <div className="relative pl-6 border-0 border-l-2 -muted space-y-6">
                        {myViolations.violations.map(v => (
                          <div key={v.id} className="relative">
                            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-background" />
                            <div className="bg-muted/30 rounded-2xl p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-amber-600 dark:text-amber-500">{v.violationType}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(v.occurredAt), 'HH:mm:ss dd/MM/yyyy')}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground break-all">{v.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-card shadow-md border-0 shadow-md border-0 space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> Giải thưởng
              </h3>
              <p className="text-sm text-muted-foreground">
                Chứng chỉ CourseMate Pro và huy hiệu đặc biệt cho Top 10 thí sinh có điểm cao nhất.
              </p>
              <div className="pt-4 shadow-md border-0 border-t-0 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Người tổ chức</span>
                  <span className="font-bold">Đội ngũ CourseMate</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phân loại</span>
                  <span className="font-bold">Công khai</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl -primary/10 bg-primary/5 space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Cần trợ giúp?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nếu bạn gặp sự cố kỹ thuật trong khi thi, vui lòng liên hệ bộ phận hỗ trợ qua kênh Discord hoặc Email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
