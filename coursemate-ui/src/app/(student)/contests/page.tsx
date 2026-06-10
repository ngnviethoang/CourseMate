'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Users, ChevronRight, Calendar, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService, ContestDto } from '@/lib/contest-service'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

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

function ContestListSkeleton() {
  return (
    <div className="grid gap-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
          <div className="flex gap-3">
            <div className="h-6 w-24 rounded-full bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>
          <div className="h-6 w-1/2 rounded-full bg-muted" />
          <div className="h-4 w-3/4 rounded-full bg-muted" />
          <div className="flex gap-6">
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="h-4 w-32 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'All' | string>('All')

  const fetchContests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await contestService.getList({
        pageSize: 10,
        ...(filter !== 'All' && { status: filter })
      })
      setContests(res.items || [])
    } catch {
      // toast.error('Không thể tải danh sách cuộc thi')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  const ongoing = contests.find(c => c.status === 'Ongoing')

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header */}
      <div className="mx-4 mt-6 rounded-[2rem] border border-border/80 relative bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-sm animate-in fade-in duration-500">
        <div className="pointer-events-none absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
              <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner border border-primary/20">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              Đấu trường lập trình
            </h1>
            <p className="text-muted-foreground text-sm ml-[48px] max-w-xl">
              Tham gia các kỳ thi, giải quyết thách thức thuật toán và leo hạng cùng cộng đồng.
            </p>
          </div>

          {ongoing && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                <Flame className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-lg leading-tight line-clamp-1">{ongoing.title}</p>
                <p className="text-emerald-600 text-sm mt-1 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Đang diễn ra ngay bây giờ!
                </p>
              </div>
              <Button
                asChild
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-11 px-6 shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Link href={`/contests/${ongoing.id}`}>
                  Tham gia ngay <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {(['All', 'Upcoming', 'Ongoing', 'Ended'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === tab
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {tab === 'All' ? 'Tất cả' : STATUS_LABEL[tab]}
            </button>
          ))}
        </div>

        {/* Contest list */}
        {loading ? (
          <ContestListSkeleton />
        ) : contests.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl bg-card/50">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có cuộc thi nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contests.map((contest, idx) => (
              <div
                key={contest.id}
                style={{ animationDelay: `${Math.min(idx * 60, 360)}ms` }}
                className={`group rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards duration-500 ${
                  contest.status === 'Ended' ? 'opacity-75 grayscale-[0.5]' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider ${STATUS_COLOR[contest.status]}`}
                      >
                        {STATUS_LABEL[contest.status]}
                      </span>
                      <span className="bg-muted px-3 py-1 rounded-full text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {contest.durationInMinutes} phút
                      </span>
                    </div>

                    <Link href={`/contests/${contest.id}`}>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {contest.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{contest.description}</p>

                    <div className="flex flex-wrap gap-6 mt-5 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary/60" />
                        {contest.participantCount} thí sinh
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        {contest.startTime
                          ? format(new Date(contest.startTime), 'dd MMMM, HH:mm', { locale: vi })
                          : 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col justify-end gap-3 w-full md:w-auto">
                    <Button
                      asChild
                      className="rounded-2xl h-12 px-8 font-bold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
                    >
                      <Link href={`/contests/${contest.id}`}>
                        {contest.status === 'Ended' ? 'Xem kết quả' : 'Chi tiết'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
