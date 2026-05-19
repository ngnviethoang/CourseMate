'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { lessonService } from '@/lib/course-service'
import { LessonDto, CreateLessonRequest, LessonType } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

const LESSON_TYPES: LessonType[] = Object.values(LessonType)

const columns: Column<LessonDto>[] = [
 { key: 'title', header: 'Title', sortKey: 'title' },
 { key: 'chapterName', header: 'Chapter' },
 { key: 'courseName', header: 'Course' },
 {
 key: 'lessonType',
 header: 'Type',
 render: row => <Badge variant="outline">{row.lessonType}</Badge>
 },
 { key: 'position', header: 'Position', sortKey: 'position' },
 { key: 'creationTime', header: 'Created', sortKey: 'creationTime', render: row => formatDate(row.creationTime) },
 {
 key: 'lastModificationTime',
 header: 'Updated',
 sortKey: 'lastModificationTime',
 render: row => formatDate(row.lastModificationTime)
 }
]

const emptyForm: CreateLessonRequest = {
 chapterId: '',
 courseId: '',
 title: '',
 lessonType: LessonType.Video,
 position: 1
}

export default function LessonsPage() {
 const router = useRouter()
 const [items, setItems] = useState<LessonDto[]>([])
 const [loading, setLoading] = useState(true)
 const [filter, setFilter] = useState('')
 const [sorting, setSorting] = useState('creationTime_desc')
 const [pageIndex, setPageIndex] = useState(0)
 const [totalCount, setTotalCount] = useState(0)
 const pageSize = 10
 const [dialogOpen, setDialogOpen] = useState(false)
 const [deleteId, setDeleteId] = useState<string | null>(null)
 const [editing, setEditing] = useState<LessonDto | null>(null)
 const [form, setForm] = useState<CreateLessonRequest>(emptyForm)
 const [saving, setSaving] = useState(false)

 const load = useCallback(async () => {
 setLoading(true)
 try {
 const res = await lessonService.list({ filter, pageSize, pageIndex, sorting })
 setItems(res.items)
 setTotalCount(res.totalCount)
 } finally {
 setLoading(false)
 }
 }, [filter, sorting, pageIndex])

 useEffect(() => {
 const t = setTimeout(load, 300)
 return () => clearTimeout(t)
 }, [load])

 function openCreate() {
 setEditing(null)
 setForm(emptyForm)
 setDialogOpen(true)
 }
 function openEdit(row: LessonDto) {
 setEditing(row)
 setForm({
 chapterId: row.chapterId,
 courseId: row.courseId,
 title: row.title,
 lessonType: row.lessonType,
 position: row.position
 })
 setDialogOpen(true)
 }

 async function handleSave() {
 setSaving(true)
 try {
 if (editing) {
 await lessonService.update(editing.id, form)
 toast.success('Lesson updated.')
 } else {
 await lessonService.create(form)
 toast.success('Lesson created.')
 }
 setDialogOpen(false)
 load()
 } finally {
 setSaving(false)
 }
 }

 async function handleDelete() {
 if (!deleteId) return
 await lessonService.delete(deleteId)
 toast.success('Lesson deleted.')
 setDeleteId(null)
 load()
 }

 const f = (field: keyof CreateLessonRequest, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-semibold">Lessons</h1>
 <p className="text-sm text-muted-foreground">Manage chapter lessons</p>
 </div>
 <Button onClick={openCreate} className="gap-2">
 <Plus className="h-4 w-4" /> New Lesson
 </Button>
 </div>

 <div className="relative max-w-sm">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 className="pl-9"
 placeholder="Search lessons…"
 value={filter}
 onChange={e => setFilter(e.target.value)}
 />
 </div>

 <DataTable
 columns={columns}
 data={items}
 loading={loading}
 sorting={sorting}
 onSort={setSorting}
 onEdit={openEdit}
 onDelete={setDeleteId}
 onView={row => router.push(`/management/lessons/${row.id}`)}
 pagination={{
 pageIndex,
 pageSize,
 totalCount,
 onPageChange: setPageIndex
 }}
 />

 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
 <DialogContent className="max-w-lg">
 <DialogHeader>
 <DialogTitle>{editing ? 'Edit Lesson' : 'New Lesson'}</DialogTitle>
 </DialogHeader>
 <div className="grid grid-cols-2 gap-4 py-2">
 <div className="col-span-2 space-y-1">
 <Label>Title</Label>
 <Input value={form.title} onChange={e => f('title', e.target.value)} />
 </div>
 <div className="space-y-1">
 <Label>Chapter ID</Label>
 <Input value={form.chapterId} onChange={e => f('chapterId', e.target.value)} />
 </div>
 <div className="space-y-1">
 <Label>Course ID</Label>
 <Input value={form.courseId} onChange={e => f('courseId', e.target.value)} />
 </div>
 <div className="space-y-1">
 <Label>Type</Label>
 <Select value={form.lessonType} onValueChange={v => f('lessonType', v as LessonType)}>
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {LESSON_TYPES.map(t => (
 <SelectItem key={t} value={t}>
 {t}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-1">
 <Label>Position</Label>
 <Input
 type="number"
 min={1}
 value={form.position}
 onChange={e => f('position', Number(e.target.value))}
 />
 </div>
 </div>
 <DialogFooter>
 <Button variant="outline" onClick={() => setDialogOpen(false)}>
 Cancel
 </Button>
 <Button onClick={handleSave} disabled={saving}>
 {saving ? 'Saving…' : 'Save'}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
 <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
 onClick={handleDelete}
 >
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </div>
 )
}
