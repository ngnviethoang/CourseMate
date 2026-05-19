'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Trophy, Clock, Users, ChevronRight, Calendar, Star, Flame, Loader2 } from 'lucide-react'
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
 {/* Header */}
 <div className="shadow-md border-0 border-b-0 bg-muted/30">
 <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
 <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
 <Trophy className="h-8 w-8 text-primary" />
 Đấu trường lập trình
 </h1>
 <p className="text-muted-foreground mt-2 text-lg">
 Tham gia các kỳ thi, giải quyết thách thức thuật toán và leo hạng cùng cộng đồng.
 </p>

 {ongoing && (
 <div className="mt-8 flex items-center gap-4 rounded-2xl -emerald-200 bg-emerald-50 p-5 shadow-md border-0">
 <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
 <Flame className="h-6 w-6" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-bold text-emerald-900 text-lg leading-tight line-clamp-1">{ongoing.title}</p>
 <p className="text-emerald-600 mt-1 flex items-center gap-2">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
 </span>
 Đang diễn ra ngay bây giờ!
 </p>
 </div>
 <Button
 asChild
 className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 h-11 px-6 shadow-md"
 >
 <Link href={`/contests/${ongoing.id}`}>
 Tham gia ngay <ChevronRight className="h-4 w-4 ml-1" />
 </Link>
 </Button>
 </div>
 )}
 </div>
 </div>

 <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
 {/* Filter tabs */}
 <div className="flex flex-wrap gap-2 mb-8">
 {(['All', 'Upcoming', 'Ongoing', 'Ended'] as const).map(tab => (
 <button
 key={tab}
 onClick={() => setFilter(tab)}
 className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
 filter === tab
 ? 'bg-primary text-primary-foreground shadow-md'
 : 'text-muted-foreground hover:text-foreground hover:bg-muted'
 }`}
 >
 {tab === 'All' ? 'Tất cả' : STATUS_LABEL[tab]}
 </button>
 ))}
 </div>

 {/* Contest list */}
 {loading ? (
 <div className="flex justify-center py-20">
 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
 </div>
 ) : contests.length === 0 ? (
 <div className="text-center py-20 -2 -dashed rounded-3xl">
 <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
 <p className="text-muted-foreground">Chưa có cuộc thi nào trong danh mục này.</p>
 </div>
 ) : (
 <div className="grid gap-6">
 {contests.map(contest => (
 <div
 key={contest.id}
 className={`group rounded-3xl bg-card p-6 shadow-md border-0 transition-all hover:shadow-lg hover:-primary/20 ${ contest.status === 'Ended' ? 'opacity-75 grayscale-[0.5]' : '' }`}
 >
 <div className="flex flex-col sm:flex-row sm:items-start gap-6">
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

 <div className="flex-shrink-0 flex sm:flex-col justify-end gap-3">
 <Button asChild className="rounded-2xl h-12 px-8 font-bold shadow-sm">
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
