'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, Trophy, Pencil, Loader2, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contestService, ContestDto } from '@/lib/contest-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface PagedDto<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
}

const STATUS_STYLE: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  Upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Ongoing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 animate-pulse',
  Ended: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const STATUS_LABEL: Record<string, string> = {
  Draft: 'Nháp',
  Upcoming: 'Sắp diễn ra',
  Ongoing: 'Đang diễn ra',
  Ended: 'Đã kết thúc'
}

export default function ContestsManagementPage() {
  const router = useRouter()
  const [data, setData] = useState<PagedDto<ContestDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [openNewModal, setOpenNewModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    durationInMinutes: 90,
    startTime: '',
    endTime: '',
    allowedLanguages: 'Java,Python,C++',
    memoryLimit: 256,
    timeLimit: 2000,
    antiCheatLevel: 'Basic'
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await contestService.getList({
        pageIndex: page,
        pageSize,
        ...(filter && { filter }),
        ...(status && { status })
      })
      setData(result)
    } catch {
      toast.error('Không thể tải danh sách cuộc thi')
    } finally {
      setLoading(false)
    }
  }, [page, filter, status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    if (!newForm.title.trim()) {
      toast.error('Tiêu đề không được để trống')
      return
    }
    setCreating(true)
    try {
      const res = await contestService.create(newForm)
      toast.success('Đã tạo cuộc thi!')
      setOpenNewModal(false)
      router.push(`/management/contests/${res.id}`)
    } catch {
      toast.error('Tạo cuộc thi thất bại')
    } finally {
      setCreating(false)
    }
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Quản lý Cuộc thi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tạo và quản lý các kỳ thi lập trình, chấm điểm và xếp hạng
          </p>
        </div>

        <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Tạo cuộc thi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo cuộc thi mới</DialogTitle>
              <DialogDescription>
                Điền các thông tin cơ bản của cuộc thi. Bạn có thể thêm bài tập sau.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  value={newForm.title}
                  onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ví dụ: Code War 2024"
                  className="w-full -input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Thời gian thi (phút)</label>
                  <input
                    type="number"
                    value={newForm.durationInMinutes}
                    onChange={e => setNewForm(f => ({ ...f, durationInMinutes: parseInt(e.target.value) }))}
                    className="w-full -input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Chống gian lận</label>
                  <select
                    value={newForm.antiCheatLevel}
                    onChange={e => setNewForm(f => ({ ...f, antiCheatLevel: e.target.value }))}
                    className="w-full -input rounded-lg px-3 py-2 text-sm focus:outline-none bg-background"
                  >
                    <option value="None">Không</option>
                    <option value="Basic">Cơ bản</option>
                    <option value="Strict">Nghiêm ngặt</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  value={newForm.description}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full -input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewModal(false)}>
                Huỷ
              </Button>
              <Button onClick={handleCreate} disabled={creating} className="gap-2 min-w-[100px]">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {creating ? 'Đang tạo...' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc thi..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 text-sm -input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={status}
          onChange={e => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="text-sm -input rounded-lg px-3 py-2 bg-background focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl bg-card shadow-md border-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="shadow-md border-0 border-b-0 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground table-cell">Thời gian</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground table-cell">Ngày tạo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground table-cell">Cập nhật lần cuối</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground">
                  Không có cuộc thi nào.
                </td>
              </tr>
            ) : (
              data?.items.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{c.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {c.durationInMinutes} phút
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLE[c.status]}`}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 table-cell">
                    {c.startTime ? (
                      <div className="text-xs space-y-0.5">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(c.startTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </p>
                        <p className="text-muted-foreground">
                          đến {c.endTime ? format(new Date(c.endTime), 'HH:mm') : '—'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">— Chưa đặt —</span>
                    )}
                  </td>
                  <td className="px-4 py-3 table-cell text-xs text-muted-foreground">
                    {format(new Date(c.creationTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                  <td className="px-4 py-3 table-cell text-xs text-muted-foreground">
                    {c.lastModificationTime
                      ? format(new Date(c.lastModificationTime), 'dd/MM/yyyy HH:mm', { locale: vi })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                      <Link href={`/management/contests/${c.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalCount > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Tổng số {data.totalCount} cuộc thi</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
