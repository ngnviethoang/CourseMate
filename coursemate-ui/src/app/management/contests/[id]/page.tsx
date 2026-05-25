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
  Calendar,
  Clock,
  Shield,
  Globe,
  Loader2,
  GripVertical,
  CheckCircle2,
  Search,
  MonitorPlay
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService, ContestDto, ContestExerciseDto } from '@/lib/contest-service'
import { api } from '@/lib/api-client'
import { format } from 'date-fns'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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
          <Button onClick={handleUpdate} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-6">
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
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Thời điểm bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={contest.startTime ? contest.startTime.slice(0, 16) : ''}
                    onChange={e => setContest({ ...contest, startTime: new Date(e.target.value).toISOString() })}
                    className="w-full -input rounded-lg px-4 py-2.5 bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Thời điểm kết thúc</label>
                  <input
                    type="datetime-local"
                    value={contest.endTime ? contest.endTime.slice(0, 16) : ''}
                    onChange={e => setContest({ ...contest, endTime: new Date(e.target.value).toISOString() })}
                    className="w-full -input rounded-lg px-4 py-2.5 bg-background"
                  />
                </div>
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
                <DialogContent className="sm:max-w-[600px]">
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
              >
                <option value="Draft">Bản nháp</option>
                <option value="Upcoming">Sắp diễn ra</option>
                <option value="Ongoing">Đang diễn ra</option>
                <option value="Ended">Đã kết thúc</option>
              </select>
              <div className="p-3 bg-blue-50 -blue-100 rounded-lg dark:bg-blue-500/5 dark:-blue-500/20">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <span className="font-bold uppercase block mb-1">Lưu ý:</span>
                  Trạng thái đang diễn ra sẽ cho phép thí sinh đăng ký và làm bài ngay lập tức.
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
