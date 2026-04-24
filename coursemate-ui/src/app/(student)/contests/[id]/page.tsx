'use client'

import { use, useState } from 'react'
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
  Code2
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'

// ─── Shared mock data (same as contests list) ─────────────────────────────────

type ContestStatus = 'ongoing' | 'upcoming' | 'ended'

const CONTESTS_DATA: Record<
  string,
  {
    id: string
    title: string
    description: string
    fullDescription: string
    difficulty: string
    difficultyColor: string
    status: ContestStatus
    participants: number
    maxParticipants: number
    durationMinutes: number
    endsAt: string
    startsAt: string
    tags: string[]
    prize: string | null
    organizer: string
    problems: { id: string; title: string; difficulty: string; difficultyColor: string; solved: number }[]
    leaderboard: { rank: number; name: string; score: number; solvedCount: number; time: string; avatar: string }[]
    rules: string[]
  }
> = {
  ct1: {
    id: 'ct1',
    title: 'Weekly Code Challenge #12',
    description: 'Giải quyết 5 bài toán thuật toán trong vòng 90 phút.',
    fullDescription: `Chào mừng đến với Weekly Code Challenge #12 — sự kiện code hằng tuần của CourseMate!

Tuần này, các thí sinh sẽ đối mặt với **5 bài toán** xoay quanh chủ đề **Đồ thị, BFS và DFS**. Đây là những thuật toán nền tảng rất quan trọng trong lập trình thi đấu và phỏng vấn tại các công ty công nghệ lớn.

Bạn sẽ có 90 phút để hoàn thành tất cả các bài. Điểm số được tính dựa trên số câu đúng và thời gian nộp bài. Nộp sớm hơn → điểm thưởng thời gian cao hơn!`,
    difficulty: 'Trung bình',
    difficultyColor: 'bg-amber-100 text-amber-700',
    status: 'ongoing',
    participants: 312,
    maxParticipants: 500,
    durationMinutes: 90,
    endsAt: '2026-03-20T20:00:00+07:00',
    startsAt: '2026-03-20T10:00:00+07:00',
    tags: ['Đồ thị', 'BFS', 'DFS'],
    prize: 'Top 3 nhận voucher khoá học 1.250.000 VNĐ',
    organizer: 'CourseMate Team',
    problems: [
      {
        id: 'p1',
        title: 'Số lượng đảo (Number of Islands)',
        difficulty: 'Trung bình',
        difficultyColor: 'text-amber-600',
        solved: 198
      },
      {
        id: 'p2',
        title: 'Đường đi ngắn nhất trong mê cung',
        difficulty: 'Trung bình',
        difficultyColor: 'text-amber-600',
        solved: 145
      },
      {
        id: 'p3',
        title: 'Phát hiện chu trình trong đồ thị',
        difficulty: 'Khó',
        difficultyColor: 'text-red-600',
        solved: 89
      },
      {
        id: 'p4',
        title: 'Clone đồ thị (Clone Graph)',
        difficulty: 'Trung bình',
        difficultyColor: 'text-amber-600',
        solved: 167
      },
      {
        id: 'p5',
        title: 'Thứ tự topo (Topological Sort)',
        difficulty: 'Khó',
        difficultyColor: 'text-red-600',
        solved: 54
      }
    ],
    leaderboard: [
      { rank: 1, name: 'nguyenvan_a', score: 2850, solvedCount: 5, time: '01:12:34', avatar: 'NA' },
      { rank: 2, name: 'tranthib', score: 2720, solvedCount: 5, time: '01:23:01', avatar: 'TB' },
      { rank: 3, name: 'lehongc', score: 2650, solvedCount: 5, time: '01:35:22', avatar: 'LC' },
      { rank: 4, name: 'phamthid', score: 2100, solvedCount: 4, time: '01:14:05', avatar: 'PD' },
      { rank: 5, name: 'vuminhe', score: 2050, solvedCount: 4, time: '01:18:33', avatar: 'VE' },
      { rank: 6, name: 'hoangvaf', score: 1980, solvedCount: 4, time: '01:22:08', avatar: 'HF' },
      { rank: 7, name: 'duongthig', score: 1400, solvedCount: 3, time: '01:05:19', avatar: 'DG' },
      { rank: 8, name: 'buivan_h', score: 1350, solvedCount: 3, time: '01:11:42', avatar: 'BH' }
    ],
    rules: [
      'Mỗi thí sinh chỉ được submit tối đa 10 lần cho mỗi bài.',
      'Mỗi lần submit sai bị trừ 5 điểm thưởng thời gian.',
      'Ngôn ngữ được phép: Python, JavaScript, Java, C++.',
      'Không được sử dụng thư viện bên ngoài ngoài thư viện chuẩn.',
      'Kết quả cuộc thi được publish sau khi kết thúc 30 phút.'
    ]
  },
  ct2: {
    id: 'ct2',
    title: 'Frontend Battle – React & CSS',
    description: 'Xây dựng một UI component đẹp nhất theo chủ đề cho trước.',
    fullDescription: `Frontend Battle là cuộc thi dành cho những ai đam mê thiết kế và lập trình giao diện.

Bạn sẽ được cung cấp một **design spec** và phải tái hiện nó bằng **React & CSS thuần** trong 2 giờ. Tác phẩm sẽ được cộng đồng đánh giá dựa trên độ chính xác, animation và UX tổng thể.`,
    difficulty: 'Dễ',
    difficultyColor: 'bg-emerald-100 text-emerald-700',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 200,
    durationMinutes: 120,
    endsAt: '2026-03-22T20:00:00+07:00',
    startsAt: '2026-03-22T10:00:00+07:00',
    tags: ['React', 'CSS', 'UI'],
    prize: 'Huy hiệu & chứng chỉ đặc biệt',
    organizer: 'CourseMate Team',
    problems: [
      {
        id: 'fp1',
        title: 'Sẽ được công bố khi bắt đầu',
        difficulty: 'Dễ',
        difficultyColor: 'text-emerald-600',
        solved: 0
      }
    ],
    leaderboard: [],
    rules: [
      'Chỉ sử dụng React + CSS thuần, không được dùng UI library.',
      'Design spec sẽ được công bố đúng giờ bắt đầu.',
      'Nộp bài dưới dạng CodeSandbox hoặc GitHub link.',
      'Cộng đồng bình chọn trong 24h sau khi cuộc thi kết thúc.'
    ]
  },
  ct3: {
    id: 'ct3',
    title: 'Data Structures Sprint',
    description: 'Thách thức nhanh về cấu trúc dữ liệu: Stack, Queue, Linked List, Tree trong 45 phút.',
    fullDescription: `Data Structures Sprint là bài kiểm tra tốc độ dành cho những ai đã nắm vững các cấu trúc dữ liệu cơ bản.

4 bài toán, 45 phút — bạn có đủ nhanh không?`,
    difficulty: 'Khó',
    difficultyColor: 'bg-red-100 text-red-700',
    status: 'upcoming',
    participants: 0,
    maxParticipants: 300,
    durationMinutes: 45,
    endsAt: '2026-03-25T18:00:00+07:00',
    startsAt: '2026-03-25T16:00:00+07:00',
    tags: ['Stack', 'Queue', 'Tree'],
    prize: null,
    organizer: 'CourseMate Team',
    problems: [
      { id: 'dp1', title: 'Sẽ được công bố khi bắt đầu', difficulty: 'Khó', difficultyColor: 'text-red-600', solved: 0 }
    ],
    leaderboard: [],
    rules: [
      'Ngôn ngữ được phép: Python, JavaScript, C++, Java.',
      'Mỗi thí sinh submit tối đa 5 lần mỗi bài.',
      'Không được tham khảo tài liệu bên ngoài.'
    ]
  },
  ct4: {
    id: 'ct4',
    title: 'Weekly Code Challenge #11',
    description: 'Chủ đề: Dynamic Programming & Memoization.',
    fullDescription: `Cuộc thi Weekly #11 đã kết thúc. Cảm ơn tất cả 287 thí sinh đã tham gia!

Chủ đề Dynamic Programming & Memoization đã mang lại nhiều bài giải sáng tạo. Xem kết quả bên dưới.`,
    difficulty: 'Khó',
    difficultyColor: 'bg-red-100 text-red-700',
    status: 'ended',
    participants: 287,
    maxParticipants: 500,
    durationMinutes: 90,
    endsAt: '2026-03-13T20:00:00+07:00',
    startsAt: '2026-03-13T10:00:00+07:00',
    tags: ['DP', 'Memoization'],
    prize: null,
    organizer: 'CourseMate Team',
    problems: [
      { id: 'q1', title: 'Climbing Stairs', difficulty: 'Dễ', difficultyColor: 'text-emerald-600', solved: 241 },
      {
        id: 'q2',
        title: 'Longest Common Subsequence',
        difficulty: 'Trung bình',
        difficultyColor: 'text-amber-600',
        solved: 178
      },
      { id: 'q3', title: 'Coin Change', difficulty: 'Trung bình', difficultyColor: 'text-amber-600', solved: 154 },
      { id: 'q4', title: 'Edit Distance', difficulty: 'Khó', difficultyColor: 'text-red-600', solved: 67 }
    ],
    leaderboard: [
      { rank: 1, name: 'codingpro_vn', score: 3100, solvedCount: 4, time: '01:08:22', avatar: 'CV' },
      { rank: 2, name: 'alice_dev', score: 2900, solvedCount: 4, time: '01:19:45', avatar: 'AD' },
      { rank: 3, name: 'bob_codes', score: 2750, solvedCount: 4, time: '01:28:10', avatar: 'BC' },
      { rank: 4, name: 'charlie_ng', score: 2100, solvedCount: 3, time: '01:02:56', avatar: 'CG' },
      { rank: 5, name: 'david_hn', score: 2050, solvedCount: 3, time: '01:07:33', avatar: 'DH' }
    ],
    rules: ['Đã kết thúc — xem kết quả ở bảng xếp hạng.']
  }
}

const STATUS_LABEL: Record<ContestStatus, string> = {
  ongoing: 'Đang diễn ra',
  upcoming: 'Sắp diễn ra',
  ended: 'Đã kết thúc'
}
const STATUS_COLOR: Record<ContestStatus, string> = {
  ongoing: 'bg-emerald-500',
  upcoming: 'bg-blue-500',
  ended: 'bg-muted-foreground'
}
const RANK_MEDAL: Record<number, string> = { 1: 'text-amber-400', 2: 'text-slate-400', 3: 'text-amber-600' }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const contest = CONTESTS_DATA[id]
  const router = useRouter()
  const [tab, setTab] = useState<'overview' | 'problems' | 'leaderboard' | 'rules'>('overview')
  const [isRegistered, setIsRegistered] = useState(false)

  if (!contest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Trophy className="h-12 w-12 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground">Không tìm thấy cuộc thi.</p>
        <Link href="/contests" className={buttonVariants({ variant: 'outline' })}>
          ← Quay lại
        </Link>
      </div>
    )
  }

  const joinPct = contest.maxParticipants > 0 ? (contest.participants / contest.maxParticipants) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/contests"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              {/* Status + difficulty */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ${STATUS_COLOR[contest.status]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-white ${contest.status === 'ongoing' ? 'animate-pulse' : ''}`}
                  />
                  {STATUS_LABEL[contest.status]}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${contest.difficultyColor}`}>
                  {contest.difficulty}
                </span>
                {contest.tags.map(t => (
                  <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl font-bold tracking-tight">{contest.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Tổ chức bởi {contest.organizer}</p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    <span className="font-semibold text-foreground">{contest.participants}</span> /{' '}
                    {contest.maxParticipants} thí sinh
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    <span className="font-semibold text-foreground">{contest.durationMinutes}</span> phút
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>
                    <span className="font-semibold text-foreground">{contest.problems.length}</span> bài toán
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(contest.startsAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Participants progress */}
              {contest.maxParticipants > 0 && (
                <div className="mt-4 max-w-xs">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Số chỗ còn lại</span>
                    <span className="font-medium text-foreground">
                      {contest.maxParticipants - contest.participants} / {contest.maxParticipants}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${joinPct}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {contest.status === 'ongoing' &&
                (isRegistered ? (
                  <Link href={`/contests/${id}/arena`}>
                    <Button className="gap-2 rounded-xl px-6 bg-emerald-600 hover:bg-emerald-500">
                      <Flame className="h-4 w-4" /> Vào phòng thi
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="gap-2 rounded-xl px-6"
                    onClick={() => {
                      setIsRegistered(true)
                      setTimeout(() => router.push(`/contests/${id}/arena`), 300)
                    }}
                  >
                    <Flame className="h-4 w-4" /> Tham gia ngay
                  </Button>
                ))}
              {contest.status === 'upcoming' && (
                <Button variant="outline" className="rounded-xl px-6" onClick={() => setIsRegistered(true)}>
                  {isRegistered ? '✓ Đã đăng ký' : 'Đăng ký tham dự'}
                </Button>
              )}
              {contest.status === 'ended' && (
                <Button variant="ghost" className="rounded-xl px-6 text-muted-foreground">
                  Xem kết quả
                </Button>
              )}
              {contest.prize && (
                <p className="text-xs text-amber-600 flex items-center gap-1 justify-center">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {contest.prize}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Tab nav */}
        <div className="flex gap-1 border-b mb-6">
          {(
            [
              { key: 'overview', label: 'Tổng quan' },
              { key: 'problems', label: `Bài toán (${contest.problems.length})` },
              { key: 'leaderboard', label: `Bảng xếp hạng (${contest.leaderboard.length})` },
              { key: 'rules', label: 'Thể lệ' }
            ] as const
          ).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6 max-w-2xl">
            <div className="prose prose-sm max-w-none">
              {contest.fullDescription.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                  }}
                />
              ))}
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Thí sinh', value: contest.participants, icon: Users },
                { label: 'Thời gian', value: `${contest.durationMinutes}p`, icon: Clock },
                { label: 'Bài toán', value: contest.problems.length, icon: Code2 },
                { label: 'Trạng thái', value: STATUS_LABEL[contest.status], icon: Trophy }
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border bg-card p-3 text-center">
                  <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problems */}
        {tab === 'problems' && (
          <div className="rounded-2xl border divide-y overflow-hidden">
            {contest.problems.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-5 py-3.5 bg-card hover:bg-muted/40 transition-colors group"
              >
                <span className="w-6 text-xs text-muted-foreground text-right flex-shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{p.title}</p>
                  {p.solved > 0 && <p className="text-xs text-muted-foreground mt-0.5">{p.solved} người đã giải</p>}
                </div>
                <span className={`text-xs font-semibold flex-shrink-0 ${p.difficultyColor}`}>{p.difficulty}</span>
                {contest.status === 'ongoing' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 h-7 rounded-xl text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => router.push(`/contests/${id}/arena`)}
                  >
                    Làm bài <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' &&
          (contest.leaderboard.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Bảng xếp hạng sẽ hiển thị khi cuộc thi kết thúc.
            </div>
          ) : (
            <div className="space-y-2">
              {contest.leaderboard.map(entry => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
                    entry.rank <= 3 ? 'bg-amber-50 border-amber-100' : 'bg-card'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex-shrink-0 flex items-center justify-center">
                    {entry.rank <= 3 ? (
                      <Medal className={`h-5 w-5 ${RANK_MEDAL[entry.rank]}`} />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {entry.avatar}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.solvedCount} bài · {entry.time}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">{entry.score.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">điểm</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Rules */}
        {tab === 'rules' && (
          <div className="max-w-2xl space-y-3">
            {contest.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{rule}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
