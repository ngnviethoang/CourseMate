'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, Loader2, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, type Column } from '@/components/admin/data-table'
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

const statusItems: Array<{ label: string; value: string | null }> = [
  { label: 'Tất cả trạng thái', value: null },
  ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))
]

const columns: Column<ContestDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
  {
    key: 'title',
    header: 'Tiêu đề',
    render: row => (
      <div>
        <p className="font-medium line-clamp-1">{row.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {row.durationInMinutes} phút
        </p>
      </div>
    )
  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: row => (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLE[row.status]}`}>
        {STATUS_LABEL[row.status]}
      </span>
    )
  },
  {
    key: 'startTime',
    header: 'Thời gian',
    render: row =>
      row.startTime ? (
        <div className="text-xs space-y-0.5">
          <p className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {format(new Date(row.startTime), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </p>
          <p className="text-muted-foreground">đến {row.endTime ? format(new Date(row.endTime), 'HH:mm') : '—'}</p>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">— Chưa đặt —</span>
      )
  },
  {
    key: 'creationTime',
    header: 'Ngày tạo',
    render: row => format(new Date(row.creationTime), 'dd/MM/yyyy HH:mm', { locale: vi })
  },
  {
    key: 'lastModificationTime',
    header: 'Cập nhật lần cuối',
    render: row =>
      row.lastModificationTime ? format(new Date(row.lastModificationTime), 'dd/MM/yyyy HH:mm', { locale: vi }) : '—'
  }
]

export default function ContestsManagementPage() {
  const router = useRouter()
  const [items, setItems] = useState<ContestDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
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

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await contestService.getList({
        pageIndex: pageIndex + 1,
        pageSize,
        ...(filter && { filter }),
        ...(status && { status })
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } catch {
      toast.error('Không thể tải danh sách cuộc thi')
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, filter, status])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, status])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function handlePageChange(nextPageIndex: number) {
    if (nextPageIndex === pageIndex) return
    setLoading(true)
    setPageIndex(nextPageIndex)
  }

  function handleStatusChange(value: string | null) {
    const next = value ?? ''
    if (next === status) return
    setLoading(true)
    setStatus(next)
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Cuộc thi</h1>
          <p className="text-sm text-muted-foreground">Tạo và quản lý các kỳ thi lập trình, chấm điểm và xếp hạng</p>
        </div>

        <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Tạo cuộc thi
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
                <Input
                  value={newForm.title}
                  onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ví dụ: Code War 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Thời gian thi (phút)</label>
                  <Input
                    type="number"
                    value={newForm.durationInMinutes}
                    onChange={e => setNewForm(f => ({ ...f, durationInMinutes: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Chống gian lận</label>
                  <select
                    value={newForm.antiCheatLevel}
                    onChange={e => setNewForm(f => ({ ...f, antiCheatLevel: e.target.value }))}
                    className="w-full h-9 rounded-lg border border-input px-3 py-2 text-sm focus:outline-none bg-background"
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
                  className="w-full rounded-lg border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm kiếm cuộc thi..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Select items={statusItems} value={status || null} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-10 min-w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusItems.map(item => (
                <SelectItem key={item.value ?? 'all-statuses'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={row => router.push(`/management/contests/${row.id}`)}
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: handlePageChange
        }}
      />
    </div>
  )
}
