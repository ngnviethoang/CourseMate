'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Trophy,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Layout,
  Settings,
  Users,
  Calendar as CalendarIcon,
  Clock,
  Shield,
  Globe,
  Loader2,
  GripVertical,
  CheckCircle2,
  Search,
  MonitorPlay,
  Gift,
  Ban,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService, ContestDto, ContestExerciseDto } from '@/lib/contest-service'
import { api } from '@/lib/api-client'
import { format } from 'date-fns'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const CONTEST_STATUS_LABELS: Record<string, string> = {
  Draft: 'Bản nháp',
  Upcoming: 'Sắp diễn ra',
  Ongoing: 'Đang diễn ra',
  Ended: 'Đã kết thúc'
}

export default function ContestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()

  const [contest, setContest] = useState<ContestDto | null>(null)
  const [exercises, setExercises] = useState<ContestExerciseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Exercise Picker
  const [allExercises, setAllExercises] = useState<any[]>([])
  const [exSearch, setExSearch] = useState('')
  const [exLoading, setExLoading] = useState(false)
  const [openExModal, setOpenExModal] = useState(false)

  // Prize Picker
  const [prizableCourses, setPrizableCourses] = useState<any[]>([])
  const [openPrizeModal, setOpenPrizeModal] = useState(false)
  const [minPrizeRank, setMinPrizeRank] = useState<number>(1)
  const [maxPrizeRank, setMaxPrizeRank] = useState<number>(1)
  const [prizeCourseId, setPrizeCourseId] = useState<string>('')
  const [prizeSearch, setPrizeSearch] = useState('')

  const fetchContest = useCallback(async () => {
    try {
      const data = await contestService.getById(id)
      setContest(data)
      const exRes = await contestService.getExercises(id)
      setExercises(exRes || [])
    } catch {
      toast.error('Không thể tải thông tin cuộc thi')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchContest()
  }, [fetchContest])

  const handleUpdate = async () => {
    if (!contest) return
    setSaving(true)
    try {
      await contestService.update(id, contest)
      toast.success('Đã lưu thay đổi')
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  const searchExercises = async () => {
    setExLoading(true)
    try {
      const res = await api.get<any>(`/api/exercises?filter=${exSearch}&pageSize=5`)
      setAllExercises(res.items || [])
    } catch {
      toast.error('Lỗi khi tìm kiếm bài tập')
    } finally {
      setExLoading(false)
    }
  }

  const addExercise = async (exercise: any) => {
    try {
      await contestService.addExercise(id, {
        exerciseId: exercise.id,
        scoreWeight: 100,
        order: exercises.length + 1
      })
      toast.success(`Đã thêm: ${exercise.title}`)
      fetchContest()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Thêm bài tập thất bại')
    }
  }

  const removeExercise = async (ceId: string) => {
    if (!confirm('Xoá bài tập này khỏi cuộc thi?')) return
    try {
      await contestService.removeExercise(id, ceId)
      toast.success('Đã xoá bài tập')
      fetchContest()
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  const fetchPrizableCourses = async () => {
    try {
      const res = await contestService.getPrizableCourses(id)
      setPrizableCourses(res || [])
    } catch {
      toast.error('Lỗi khi tải danh sách khóa học')
    }
  }

  const handleOpenPrizeModal = () => {
    setOpenPrizeModal(true)
    setPrizeSearch('')
    fetchPrizableCourses()
  }

  const addPrize = async () => {
    if (!prizeCourseId) return
    if (minPrizeRank > maxPrizeRank) {
      toast.error('Hạng nhỏ nhất không được lớn hơn hạng lớn nhất')
      return
    }
    try {
      await contestService.addPrize(id, minPrizeRank, maxPrizeRank, prizeCourseId)
      toast.success('Thêm giải thưởng thành công')
      setOpenPrizeModal(false)
      fetchContest()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi khi thêm giải thưởng')
    }
  }

  const removePrize = async (prizeId: string) => {
    if (!confirm('Xoá giải thưởng này?')) return
    try {
      await contestService.removePrize(id, prizeId)
      toast.success('Đã xoá giải thưởng')
      fetchContest()
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  const handleEndContest = async () => {
    if (!confirm('Bạn có chắc chắn muốn KẾT THÚC cuộc thi này? Thao tác này sẽ chốt sổ bảng xếp hạng và trao các giải thưởng đã cấu hình (nếu có).')) return
    try {
      await contestService.endContest(id)
      toast.success('Đã kết thúc cuộc thi và trao giải')
      fetchContest()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi kết thúc cuộc thi')
    }
  }

  const handleStartContest = async () => {
    if (!confirm('Bạn có chắc chắn muốn BẮT ĐẦU cuộc thi này ngay bây giờ? Thí sinh sẽ có thể tham gia làm bài ngay.')) return
    try {
      await contestService.update(id, { ...contest, status: 'Ongoing' })
      toast.success('Đã bắt đầu cuộc thi')
      fetchContest()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi bắt đầu cuộc thi')
    }
  }

  const handleCancelContest = async () => {
    if (!confirm('Bạn có chắc chắn muốn HỦY cuộc thi này? Sẽ không có giải thưởng nào được trao.')) return
    try {
      await contestService.cancelContest(id)
      toast.success('Đã hủy cuộc thi')
      fetchContest()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi hủy cuộc thi')
    }
  }

  const DateTimePicker = ({ value, onChange, label }: { value: string | null; onChange: (val: string) => void; label: string }) => {
    const dateObj = value ? new Date(value) : undefined

    const handleDateSelect = (d: Date | undefined) => {
      if (!d) return
      if (dateObj) {
        d.setHours(dateObj.getHours())
        d.setMinutes(dateObj.getMinutes())
      }
      onChange(d.toISOString())
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!dateObj) return
      const [hours, minutes] = e.target.value.split(':')
      const newDate = new Date(dateObj)
      newDate.setHours(parseInt(hours, 10))
      newDate.setMinutes(parseInt(minutes, 10))
      onChange(newDate.toISOString())
    }

    return (
      <div className="space-y-1.5 flex flex-col w-full">
        <label className="text-sm font-medium">{label}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background px-4 py-2.5 h-auto",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(dateObj!, 'dd/MM/yyyy HH:mm') : <span>Chọn thời gian</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateObj}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="p-3 border-t">
              <label className="text-sm font-medium mb-1 block">Thời gian</label>
              <input
                type="time"
                value={dateObj ? format(dateObj, 'HH:mm') : ''}
                onChange={handleTimeChange}
                disabled={!value}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )

  if (!contest) return <div>Không tìm thấy cuộc thi</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{contest.title}</h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${contest.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600 -emerald-200' : 'bg-slate-50 text-slate-500'}`}
              >
                {CONTEST_STATUS_LABELS[contest.status] ?? contest.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Quản lý nội dung và cấu hình cuộc thi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {contest.status === 'Ongoing' && (
            <Link
              href={`/management/contests/${id}/monitor`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 -red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-semibold"
            >
              <MonitorPlay className="h-4 w-4" />
              Giám sát trực tiếp
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            </Link>
          )}
          <Link
            href={`/management/contests/${id}/violations`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 hover:bg-amber-500/20 transition-colors text-sm font-semibold"
          >
            <Shield className="h-4 w-4" />
            Đối soát vi phạm
          </Link>
          <Button onClick={handleUpdate} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="col-span-2 space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-md border-0 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Thông tin cơ bản
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tiêu đề</label>
                <input
                  value={contest.title}
                  onChange={e => setContest({ ...contest, title: e.target.value })}
                  className="w-full -input rounded-lg px-4 py-2.5 bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mô tả (Markdown)</label>
                <textarea
                  value={contest.description}
                  onChange={e => setContest({ ...contest, description: e.target.value })}
                  rows={6}
                  className="w-full -input rounded-lg px-4 py-2.5 bg-background focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DateTimePicker 
                  label="Thời điểm bắt đầu" 
                  value={contest.startTime} 
                  onChange={val => setContest({ ...contest, startTime: val })} 
                />
                <DateTimePicker 
                  label="Thời điểm kết thúc" 
                  value={contest.endTime} 
                  onChange={val => setContest({ ...contest, endTime: val })} 
                />
              </div>
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-md border-0 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" /> Danh sách bài tập ({exercises.length})
              </h2>
              <Dialog open={openExModal} onOpenChange={setOpenExModal}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Thêm bài tập
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>Thêm bài tập từ thư viện</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex gap-2">
                      <input
                        placeholder="Tìm bài tập..."
                        value={exSearch}
                        onChange={e => setExSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && searchExercises()}
                        className="flex-1 rounded-lg px-3 py-2"
                      />
                      <Button onClick={searchExercises} disabled={exLoading}>
                        {exLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                      {allExercises.map(ex => (
                        <div key={ex.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                          <div>
                            <p className="font-medium">{ex.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {ex.category} • {ex.difficulty}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => addExercise(ex)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {allExercises.length === 0 && !exLoading && (
                        <p className="text-center py-8 text-muted-foreground text-sm">Tìm kiếm để bắt đầu...</p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {exercises.length === 0 ? (
                <div className="text-center py-12 -2 -dashed rounded-xl text-muted-foreground">
                  Chưa có bài tập nào. Hãy thêm từ thư viện.
                </div>
              ) : (
                exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-card shadow-md border-0 hover:-primary/30 transition-colors group"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground/30 cursor-grab" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {idx + 1}. {ex.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ex.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Trọng số</p>
                        <p className="font-mono">{ex.scoreWeight}đ</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExercise(ex.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Prizes Section */}
          <section className="bg-card rounded-xl p-6 shadow-md border-0 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-500" /> Cơ cấu giải thưởng ({(contest as any).prizes?.length || 0})
              </h2>
              <Dialog open={openPrizeModal} onOpenChange={setOpenPrizeModal}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleOpenPrizeModal} disabled={contest.status === 'Ended' || contest.status === 'Cancelled'}>
                    <Plus className="h-4 w-4 mr-2" /> Thêm giải thưởng
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:!max-w-[650px] !max-w-[calc(100%-2rem)]">
                  <DialogHeader>
                    <DialogTitle>Thêm/Sửa giải thưởng khóa học</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 min-w-0">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <div className="flex gap-4 shrink-0">
                        <div className="space-y-1.5 w-24 shrink-0">
                          <label className="text-sm font-medium">Từ hạng</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Trophy className="h-4 w-4 text-amber-500" />
                            </div>
                            <input
                              type="number"
                              min={1}
                              value={minPrizeRank}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 1
                                setMinPrizeRank(val)
                                if (val > maxPrizeRank) setMaxPrizeRank(val)
                              }}
                              className="w-full border border-input rounded-lg pl-9 pr-2 py-2 bg-background font-bold text-amber-600 outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 w-24 shrink-0">
                          <label className="text-sm font-medium">Đến hạng</label>
                          <div className="relative">
                            <input
                              type="number"
                              min={minPrizeRank}
                              value={maxPrizeRank}
                              onChange={e => setMaxPrizeRank(parseInt(e.target.value) || minPrizeRank)}
                              className="w-full border border-input rounded-lg px-3 py-2 bg-background font-bold text-amber-600 outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <label className="text-sm font-medium">Tìm khóa học</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            placeholder="Nhập tên khóa học..."
                            value={prizeSearch}
                            onChange={e => setPrizeSearch(e.target.value)}
                            className="w-full min-w-0 border border-input rounded-lg pl-9 pr-4 py-2 bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Danh sách khóa học khả dụng</label>
                      <div className="h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {prizableCourses
                          .filter(c => c.title.toLowerCase().includes(prizeSearch.toLowerCase()))
                          .map(c => (
                            <div
                              key={c.id}
                              onClick={() => setPrizeCourseId(c.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${prizeCourseId === c.id
                                  ? 'border-primary bg-primary/5 shadow-sm'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                }`}
                            >
                              <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                                {c.imageUrl ? (
                                  <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <Trophy className="h-5 w-5 text-primary/40" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{c.title}</p>
                                <p className="text-xs text-muted-foreground truncate">bởi {c.instructorName}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-4">
                                <div className="text-right">
                                  {c.price === 0 ? (
                                    <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">Miễn phí</span>
                                  ) : (
                                    <span className="text-sm font-semibold text-amber-600">{c.price.toLocaleString('vi-VN')} đ</span>
                                  )}
                                </div>
                                {prizeCourseId === c.id ? (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                                )}
                              </div>
                            </div>
                          ))}
                        {prizableCourses.filter(c => c.title.toLowerCase().includes(prizeSearch.toLowerCase())).length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p className="text-sm">Không tìm thấy khóa học nào phù hợp</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setOpenPrizeModal(false)}>
                        Hủy
                      </Button>
                      <Button onClick={addPrize} disabled={!prizeCourseId} className="px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md">
                        <Gift className="h-4 w-4 mr-2" /> Lưu giải thưởng
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {!(contest as any).prizes?.length ? (
                <div className="text-center py-8 -2 -dashed rounded-xl text-muted-foreground">
                  Chưa có giải thưởng. Hãy cấu hình để thu hút thí sinh.
                </div>
              ) : (
                (contest as any).prizes.map((prize: any) => (
                  <div
                    key={prize.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-card shadow-sm border border-amber-500/20 hover:border-amber-500/40 transition-colors group"
                  >
                    <div className="shrink-0 px-3 h-12 rounded-xl bg-amber-100 flex flex-col items-center justify-center font-black text-amber-700 min-w-[3rem]">
                      {prize.minRank === prize.maxRank ? (
                        <span>#{prize.minRank}</span>
                      ) : (
                        <>
                          <span className="text-[10px] uppercase font-bold opacity-80 leading-tight">Top</span>
                          <span className="text-sm leading-tight">{prize.minRank}-{prize.maxRank}</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{prize.courseTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {prize.coursePrice > 0 ? `Trị giá ${prize.coursePrice.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                      </p>
                    </div>
                    {contest.status !== 'Ended' && contest.status !== 'Cancelled' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePrize(prize.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Violations Link Card */}
          <section className="bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-900/10 dark:to-red-900/10 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Quản lý vi phạm</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Xem toàn bộ lịch sử vi phạm, xét duyệt và xử lý các trường hợp gian lận trong cuộc thi này.
                </p>
              </div>
            </div>
            <Link
              href={`/management/contests/${id}/violations`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors w-full justify-center"
            >
              <Shield className="h-4 w-4" />
              Mở trang đối soát vi phạm
            </Link>
          </section>
        </div>

        {/* Right Column: Constraints & Status */}
        <div className="space-y-6">
          <section className="bg-card rounded-xl p-6 shadow-md border-0 space-y-4">
            <h3 className="font-semibold">Trạng thái vận hành</h3>
            <div className="space-y-3">
              <select
                value={contest.status}
                onChange={e => setContest({ ...contest, status: e.target.value as any })}
                className="w-full rounded-lg px-3 py-2.5 bg-background text-sm font-medium"
                disabled={contest.status === 'Ended' || contest.status === 'Cancelled'}
              >
                <option value="Draft">Bản nháp</option>
                <option value="Upcoming">Sắp diễn ra</option>
                <option value="Ongoing">Đang diễn ra</option>
                <option value="Ended">Đã kết thúc</option>
                <option value="Cancelled">Đã hủy</option>
              </select>

              {contest.status !== 'Ended' && contest.status !== 'Cancelled' && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  {(contest.status === 'Draft' || contest.status === 'Upcoming') && (
                    <Button
                      onClick={handleStartContest}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MonitorPlay className="w-4 h-4 mr-2" /> Bắt đầu cuộc thi
                    </Button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleEndContest}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Kết thúc
                    </Button>
                    <Button
                      onClick={handleCancelContest}
                      variant="destructive"
                      className="w-full"
                    >
                      <Ban className="w-4 h-4 mr-2" /> Hủy cuộc thi
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 -blue-100 rounded-lg dark:bg-blue-500/5 dark:-blue-500/20">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <span className="font-bold uppercase block mb-1">Lưu ý:</span>
                  Trạng thái đang diễn ra sẽ cho phép thí sinh đăng ký và làm bài ngay lập tức. Khi bấm Kết thúc, hệ thống sẽ chốt sổ và trao giải tự động.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-xl p-6 shadow-md border-0 space-y-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Ràng buộc kỹ thuật
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" /> Ngôn ngữ cho phép
                </label>
                <input
                  value={contest.allowedLanguages}
                  onChange={e => setContest({ ...contest, allowedLanguages: e.target.value })}
                  placeholder="Java, Python, C++"
                  className="w-full -input rounded-lg px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Giới hạn bộ nhớ (MB)</label>
                <input
                  type="number"
                  value={contest.memoryLimit}
                  onChange={e => setContest({ ...contest, memoryLimit: parseInt(e.target.value) })}
                  className="w-full -input rounded-lg px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Giới hạn thời gian (ms)</label>
                <input
                  type="number"
                  value={contest.timeLimit}
                  onChange={e => setContest({ ...contest, timeLimit: parseInt(e.target.value) })}
                  className="w-full -input rounded-lg px-3 py-2 text-sm bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cấp độ chống gian lận</label>
                <select
                  value={contest.antiCheatLevel}
                  onChange={e => setContest({ ...contest, antiCheatLevel: e.target.value as any })}
                  className="w-full -input rounded-lg px-3 py-2 text-sm bg-background"
                >
                  <option value="None">Không bật</option>
                  <option value="Basic">Cơ bản (chuyển tab)</option>
                  <option value="Strict">Nghiêm ngặt (camera/khóa màn hình)</option>
                </select>
              </div>

              {contest.antiCheatLevel !== 'None' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    Số vi phạm tối đa (chế độ nghiêm ngặt)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={contest.maxViolations}
                    onChange={e => setContest({ ...contest, maxViolations: parseInt(e.target.value) || 5 })}
                    className="w-full -input rounded-lg px-3 py-2 text-sm bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Khi chọn nghiêm ngặt: thí sinh sẽ bị loại nếu vượt ngưỡng này.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 shadow-md border-0 text-center">
              <Users className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold">{contest.participantCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Thí sinh</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-md border-0 text-center">
              <Layout className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-2xl font-bold">{exercises.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Bài tập</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
