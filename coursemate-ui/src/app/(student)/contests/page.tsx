'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Clock, Users, ChevronRight, Calendar, Star, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ─── Mock data ────────────────────────────────────────────────────────────────

type ContestStatus = 'ongoing' | 'upcoming' | 'ended'

const CONTESTS = [
  {
    id: 'ct1',
    title: 'Weekly Code Challenge #12',
    description: 'Giải quyết 5 bài toán thuật toán trong vòng 90 phút. Chủ đề tuần này: Đồ thị & BFS/DFS.',
    difficulty: 'Trung bình',
    difficultyColor: 'bg-amber-100 text-amber-700',
    status: 'ongoing' as ContestStatus,
    participants: 312,
    durationMinutes: 90,
    endsAt: '2026-03-20T20:00:00+07:00',
    startsAt: '2026-03-20T10:00:00+07:00',
    tags: ['Đồ thị', 'BFS', 'DFS'],
    prize: 'Top 3 nhận voucher 1.250.000 VNĐ'
  },
  {
    id: 'ct2',
    title: 'Frontend Battle – React & CSS',
    description: 'Xây dựng một UI component đẹp nhất theo chủ đề cho trước. Đánh giá bởi cộng đồng.',
    difficulty: 'Dễ',
    difficultyColor: 'bg-emerald-100 text-emerald-700',
    status: 'upcoming' as ContestStatus,
    participants: 0,
    durationMinutes: 120,
    endsAt: '2026-03-22T20:00:00+07:00',
    startsAt: '2026-03-22T10:00:00+07:00',
    tags: ['React', 'CSS', 'UI'],
    prize: 'Huy hiệu & chứng chỉ đặc biệt'
  },
  {
    id: 'ct3',
    title: 'Data Structures Sprint',
    description: 'Thách thức nhanh về cấu trúc dữ liệu: Stack, Queue, Linked List, Tree trong 45 phút.',
    difficulty: 'Khó',
    difficultyColor: 'bg-red-100 text-red-700',
    status: 'upcoming' as ContestStatus,
    participants: 0,
    durationMinutes: 45,
    endsAt: '2026-03-25T18:00:00+07:00',
    startsAt: '2026-03-25T16:00:00+07:00',
    tags: ['Stack', 'Queue', 'Tree'],
    prize: null
  },
  {
    id: 'ct4',
    title: 'Weekly Code Challenge #11',
    description: 'Chủ đề: Dynamic Programming & Memoization.',
    difficulty: 'Khó',
    difficultyColor: 'bg-red-100 text-red-700',
    status: 'ended' as ContestStatus,
    participants: 287,
    durationMinutes: 90,
    endsAt: '2026-03-13T20:00:00+07:00',
    startsAt: '2026-03-13T10:00:00+07:00',
    tags: ['DP', 'Memoization'],
    prize: null
  }
]

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContestsPage() {
  const [filter, setFilter] = useState<'all' | ContestStatus>('all')

  const filtered = filter === 'all' ? CONTESTS : CONTESTS.filter(c => c.status === filter)
  const ongoing = CONTESTS.filter(c => c.status === 'ongoing')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Cuộc thi lập trình
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tham gia các cuộc thi, rèn luyện kỹ năng và nhận phần thưởng hấp dẫn.
          </p>

          {/* Active contest highlight */}
          {ongoing.length > 0 && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <Flame className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-800 leading-tight line-clamp-1">{ongoing[0].title}</p>
                <p className="text-xs text-emerald-600 mt-0.5">đang diễn ra ngay bây giờ!</p>
              </div>
              <Button
                size="sm"
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0 h-8 px-4 text-xs gap-1"
              >
                Tham gia <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'ongoing', 'upcoming', 'ended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab === 'all' ? 'Tất cả' : STATUS_LABEL[tab]}
              <span className="ml-1.5 text-xs">
                ({tab === 'all' ? CONTESTS.length : CONTESTS.filter(c => c.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Contest list */}
        <div className="space-y-4">
          {filtered.map(contest => (
            <div
              key={contest.id}
              className={`group rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md ${
                contest.status === 'ended' ? 'opacity-70' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status + difficulty badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                  </div>

                  <Link href={`/contests/${contest.id}`}>
                    <h3 className="font-semibold leading-snug hover:text-primary transition-colors">{contest.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{contest.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {contest.tags.map(tag => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {contest.durationMinutes} phút
                    </span>
                    {contest.participants > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {contest.participants} người tham gia
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(contest.status === 'ended' ? contest.endsAt : contest.startsAt).toLocaleDateString(
                        'vi-VN',
                        { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>

                  {contest.prize && (
                    <p className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {contest.prize}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  {contest.status === 'ongoing' && (
                    <Button className="rounded-xl gap-1 h-9 text-sm">
                      Tham gia <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {contest.status === 'upcoming' && (
                    <Button variant="outline" className="rounded-xl h-9 text-sm">
                      Đăng ký
                    </Button>
                  )}
                  {contest.status === 'ended' && (
                    <Button variant="ghost" size="sm" className="rounded-xl h-9 text-sm text-muted-foreground">
                      Xem kết quả
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
