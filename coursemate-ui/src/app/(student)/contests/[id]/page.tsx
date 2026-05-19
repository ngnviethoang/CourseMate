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
  List
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { contestService, ContestDto, ContestLeaderboardDto } from '@/lib/contest-service'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'sonner'

const STATUS_LABEL: Record<string, string> = {
  Ongoing: 'Đang diễn ra',
  Upcoming: 'Sắp diễn ra',
  Ended: 'Đã kết thúc'
}

const STATUS_COLOR: Record<string, string> = {
  Ongoing: 'bg-emerald-500',
  Upcoming: 'bg-blue-500',
  Ended: 'bg-muted-foreground'
}

const RANK_MEDAL: Record<number, string> = { 1: 'text-amber-400', 2: 'text-slate-400', 3: 'text-amber-600' }

export default function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [contest, setContest] = useState<ContestDto | null>(null)
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboardDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [tab, setTab] = useState<'overview' | 'exercises' | 'leaderboard' | 'rules'>('overview')

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
    }
  }, [tab, fetchLeaderboard])

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
      {/* Header Section */}
      <div className="shadow-md border-0 border-b-0 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider ${STATUS_COLOR[contest.status]}`}
                >
                  {STATUS_LABEL[contest.status]}
                </span>
                {contest.antiCheatLevel !== 'None' && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Anti-cheat: {contest.antiCheatLevel}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight">{contest.title}</h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary/60" />
                  {contest.startTime
                    ? format(new Date(contest.startTime), 'EEEE, dd MMMM HH:mm', { locale: vi })
                    : 'TBA'}
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
                  <Button
                    onClick={handleJoin}
                    className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 gap-2"
                  >
                    <Flame className="h-5 w-5" /> Vào phòng thi
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={registering}
                    className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-2"
                  >
                    {registering ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trophy className="h-5 w-5" />}
                    Đăng ký & Thi ngay
                  </Button>
                )
              ) : contest.status === 'Upcoming' ? (
                <Button
                  onClick={handleRegister}
                  disabled={registering || contest.isRegistered}
                  variant={contest.isRegistered ? 'outline' : 'default'}
                  className="h-14 px-10 rounded-2xl text-lg font-bold shadow-lg"
                >
                  {contest.isRegistered ? '✓ Đã đăng ký' : 'Đăng ký tham dự'}
                </Button>
              ) : (
                <Button asChild variant="secondary" className="h-14 px-10 rounded-2xl text-lg font-bold">
                  <Link href={`/contests/${id}/leaderboard`}>Xem kết quả cuối cùng</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-8 shadow-md border-0 border-b-0 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Tổng quan', icon: Layout },
            { id: 'exercises', label: `Bài tập (${exercises.length})`, icon: List },
            { id: 'leaderboard', label: 'Bảng xếp hạng', icon: Trophy },
            { id: 'rules', label: 'Thể lệ & Hướng dẫn', icon: CheckCircle2 }
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
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
                          {entry.totalRuntime.toFixed(2)}s runtime •{' '}
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
                    'Hệ thống Anti-cheat sẽ theo dõi các hành vi bất thường (chuyển tab, sao chép code).',
                    'Bài làm được chấm tự động dựa trên bộ test cases mẫu và ẩn.',
                    'Thứ hạng dựa trên Tổng điểm > Runtime > Thời gian nộp bài.',
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
                  <span className="font-bold">CourseMate Official</span>
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
