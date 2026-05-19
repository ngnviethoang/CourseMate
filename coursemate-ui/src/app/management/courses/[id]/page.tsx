'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { courseService, chapterService } from '@/lib/course-service'
import { Pagination } from '@/components/admin/pagination'
import 'react-quill-new/dist/quill.snow.css'
import type {
 CourseDto,
 ChapterDto,
 CreateChapterRequest,
 UpdateChapterRequest,
 UpdateCourseRequest
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

// ─── Chapter modal state ──────────────────────────────────────────────────────
const emptyChapterForm = (courseId: string): CreateChapterRequest => ({
 courseId,
 title: '',
 position: 0
})

function ChapterRow({
 chapter,
 onEditChapter,
 onDeleteChapter
}: {
 chapter: ChapterDto
 onEditChapter: (c: ChapterDto) => void
 onDeleteChapter: (id: string) => void
}) {
 const router = useRouter()

 return (
 <div
 className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card shadow-md border-0 shadow-md border-0 cursor-pointer hover:-primary/30 transition-colors group select-none"
 onClick={() => router.push(`/management/chapters/${chapter.id}`)}
 >
 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
 <span className="text-sm font-medium">{chapter.position}</span>
 </div>
 <span className="flex-1 font-medium text-sm">{chapter.title}</span>
 <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
 <button
 onClick={() => onEditChapter(chapter)}
 className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
 >
 <Pencil className="h-3.5 w-3.5" />
 </button>
 <button
 onClick={() => onDeleteChapter(chapter.id)}
 className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:-destructive/20 transition-colors"
 >
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </div>
 )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
 const { id } = useParams<{ id: string }>()
 const router = useRouter()

 const [course, setCourse] = useState<CourseDto | null>(null)
 const [courseLoading, setCourseLoading] = useState(true)

 const [chapters, setChapters] = useState<ChapterDto[]>([])
 const [chaptersLoading, setChaptersLoading] = useState(true)
 const [pageIndex, setPageIndex] = useState(0)
 const [totalCount, setTotalCount] = useState(0)
 const pageSize = 10

 // Chapter modal
 const [chapterDialog, setChapterDialog] = useState(false)
 const [editingChapter, setEditingChapter] = useState<ChapterDto | null>(null)
 const [chapterForm, setChapterForm] = useState<CreateChapterRequest>(emptyChapterForm(id))
 const [savingChapter, setSavingChapter] = useState(false)
 const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null)

 // UI state
 const [showFullDesc, setShowFullDesc] = useState(false)

 // Course edit modal
 const [courseDialog, setCourseDialog] = useState(false)
 const [savingCourse, setSavingCourse] = useState(false)
 const [courseForm, setCourseForm] = useState<UpdateCourseRequest>({
 title: '',
 description: '',
 price: 0,
 imageUrl: '',
 isPublished: false,
 categoryId: '',
 instructorId: ''
 })
 const [mounted, setMounted] = useState(false)

 useEffect(() => {
 setMounted(true)
 }, [])

 // Load course
 const loadCourse = useCallback(async () => {
 setCourseLoading(true)
 try {
 const c = await courseService.getById(id)
 setCourse(c)
 } catch {
 toast.error('Course not found.')
 } finally {
 setCourseLoading(false)
 }
 }, [id])

 useEffect(() => {
 loadCourse()
 }, [loadCourse])

 // Load chapters
 const loadChapters = useCallback(async () => {
 setChaptersLoading(true)
 try {
 const res = await chapterService.list({ courseId: id, pageSize, pageIndex, sorting: 'position' })
 setChapters(res.items)
 setTotalCount(res.totalCount)
 } finally {
 setChaptersLoading(false)
 }
 }, [id, pageIndex])

 useEffect(() => {
 loadChapters()
 }, [loadChapters])

 // ─── Course handlers ────────────────────────────────────────────────────────
 function openEditCourse() {
 if (!course) return
 setCourseForm({
 title: course.title,
 description: course.description || '',
 price: course.price,
 imageUrl: course.imageUrl || '',
 isPublished: course.isPublished,
 categoryId: course.categoryId,
 instructorId: course.instructorId || ''
 })
 setCourseDialog(true)
 }

 async function saveCourse() {
 setSavingCourse(true)
 try {
 await courseService.update(id, courseForm)
 toast.success('Course updated successfully.')
 setCourseDialog(false)
 loadCourse()
 } catch {
 toast.error('Failed to update course.')
 } finally {
 setSavingCourse(false)
 }
 }

 // ─── Chapter handlers ───────────────────────────────────────────────────────
 function openCreateChapter() {
 setEditingChapter(null)
 setChapterForm(emptyChapterForm(id))
 setChapterDialog(true)
 }

 function openEditChapter(c: ChapterDto) {
 setEditingChapter(c)
 setChapterForm({ courseId: c.courseId, title: c.title, position: c.position })
 setChapterDialog(true)
 }

 async function saveChapter() {
 setSavingChapter(true)
 try {
 if (editingChapter) {
 await chapterService.update(editingChapter.id, chapterForm as UpdateChapterRequest)
 toast.success('Chapter updated.')
 } else {
 await chapterService.create(chapterForm)
 toast.success('Chapter created.')
 }
 setChapterDialog(false)
 loadChapters()
 } finally {
 setSavingChapter(false)
 }
 }

 async function deleteChapter() {
 if (!deleteChapterId) return
 await chapterService.delete(deleteChapterId)
 toast.success('Chapter deleted.')
 setDeleteChapterId(null)
 loadChapters()
 }

 const cf = (field: keyof CreateChapterRequest, value: unknown) =>
 setChapterForm(prev => ({ ...prev, [field]: value }))

 // ─── Render ─────────────────────────────────────────────────────────────────
 if (courseLoading) {
 return (
 <div className="flex h-64 items-center justify-center">
 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
 </div>
 )
 }

 if (!course) {
 return <div className="text-center py-16 text-muted-foreground">Course not found.</div>
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-start gap-4">
 <button
 onClick={() => router.back()}
 className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
 >
 <ArrowLeft className="h-4 w-4" />
 </button>
 <div className="flex-1 min-w-0">
 <h1 className="text-2xl font-semibold truncate">{course.title}</h1>
 <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
 <span>📂 {course.categoryName}</span>
 <span>👤 {course.instructorName ?? 'No instructor'}</span>
 <span>💵 {formatCurrency(course.price)}</span>
 <Badge variant={course.isPublished ? 'default' : 'secondary'}>
 {course.isPublished ? 'Published' : 'Draft'}
 </Badge>
 </div>
 </div>
 <Button size="sm" variant="outline" className="h-9 gap-2 shadow-sm shrink-0" onClick={openEditCourse}>
 <Settings className="h-4 w-4" /> Edit Course
 </Button>
 </div>

 {/* Description section */}
 {course.description && (
 <div className="rounded-xl bg-card p-6 shadow-md border-0 overflow-hidden flex flex-col">
 <h2 className="text-base font-semibold mb-4">Course Description</h2>
 <div className="relative">
 <div
 className={`prose prose-sm max-w-none dark:prose-invert prose-img:rounded-md prose-img:mx-auto transition-all duration-300 ${!showFullDesc ? 'max-h-64 overflow-hidden' : ''}`}
 dangerouslySetInnerHTML={{ __html: course.description }}
 />
 {!showFullDesc && (
 <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
 )}
 </div>
 <Button
 variant="ghost"
 size="sm"
 onClick={() => setShowFullDesc(!showFullDesc)}
 className="mt-2 self-center text-muted-foreground hover:text-foreground"
 >
 {showFullDesc ? 'Show less' : 'Show more'}
 </Button>
 </div>
 )}

 {/* Chapters section */}
 <div>
 <div className="flex items-center justify-between mb-3">
 <h2 className="text-base font-semibold">
 Chapters <span className="text-muted-foreground font-normal text-sm">({chapters.length})</span>
 </h2>
 <Button size="sm" onClick={openCreateChapter} className="gap-1.5">
 <Plus className="h-3.5 w-3.5" /> Add Chapter
 </Button>
 </div>

 {chaptersLoading ? (
 <div className="flex h-32 items-center justify-center">
 <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
 </div>
 ) : chapters.length === 0 ? (
 <div className="rounded-xl border-0 -dashed bg-muted/30 shadow-inner py-12 text-center">
 <p className="text-sm text-muted-foreground">No chapters yet.</p>
 <Button size="sm" variant="outline" onClick={openCreateChapter} className="mt-3 gap-1.5">
 <Plus className="h-3.5 w-3.5" /> Add first chapter
 </Button>
 </div>
 ) : (
 <div className="space-y-2">
 {chapters.map(ch => (
 <ChapterRow
 key={ch.id}
 chapter={ch}
 onEditChapter={openEditChapter}
 onDeleteChapter={setDeleteChapterId}
 />
 ))}
 <div className="pt-2">
 <Pagination
 pageIndex={pageIndex}
 pageSize={pageSize}
 totalCount={totalCount}
 onPageChange={setPageIndex}
 />
 </div>
 </div>
 )}
 </div>

 {/* ── Chapter Modal ── */}
 <Dialog open={chapterDialog} onOpenChange={setChapterDialog}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>{editingChapter ? 'Edit Chapter' : 'New Chapter'}</DialogTitle>
 </DialogHeader>
 <div className="space-y-4 py-2">
 <div className="space-y-1">
 <Label>Title</Label>
 <Input
 placeholder="Chapter title"
 value={chapterForm.title}
 onChange={e => cf('title', e.target.value)}
 />
 </div>
 </div>
 <DialogFooter>
 <Button variant="outline" onClick={() => setChapterDialog(false)}>
 Cancel
 </Button>
 <Button onClick={saveChapter} disabled={savingChapter}>
 {savingChapter ? 'Saving…' : editingChapter ? 'Save Changes' : 'Create Chapter'}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>

 {/* ── Delete Chapter Confirm ── */}
 <AlertDialog open={!!deleteChapterId} onOpenChange={open => !open && setDeleteChapterId(null)}>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete chapter?</AlertDialogTitle>
 <AlertDialogDescription>All lessons inside this chapter will also be deleted.</AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
 onClick={deleteChapter}
 >
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>

 <Dialog open={courseDialog} onOpenChange={setCourseDialog}>
 <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
 {mounted && (
 <>
 <DialogHeader>
 <DialogTitle>Edit Course Information</DialogTitle>
 </DialogHeader>
 <div className="space-y-6 py-2">
 <div className="space-y-1.5">
 <Label>Title</Label>
 <Input
 value={courseForm.title}
 onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))}
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <Label>Category ID</Label>
 <Input
 value={courseForm.categoryId}
 onChange={e => setCourseForm(f => ({ ...f, categoryId: e.target.value }))}
 />
 </div>
 <div className="space-y-1.5">
 <Label>Instructor ID</Label>
 <Input
 value={courseForm.instructorId}
 onChange={e => setCourseForm(f => ({ ...f, instructorId: e.target.value }))}
 />
 </div>
 <div className="space-y-1.5">
 <Label>Price (VNĐ)</Label>
 <Input
 type="number"
 min={0}
 step={0.01}
 value={courseForm.price}
 onChange={e => setCourseForm(f => ({ ...f, price: Number(e.target.value) }))}
 />
 </div>
 <div className="space-y-1.5">
 <Label>Image URL (Thumbnail)</Label>
 <Input
 value={courseForm.imageUrl}
 onChange={e => setCourseForm(f => ({ ...f, imageUrl: e.target.value }))}
 />
 </div>
 </div>

 <div className="flex items-center justify-between rounded-lg p-4 bg-muted/20">
 <div className="space-y-0.5">
 <Label className="text-base">Publish Course</Label>
 <p className="text-sm text-muted-foreground">
 Make this course visible to students. Select to publish.
 </p>
 </div>
 <Switch
 checked={courseForm.isPublished}
 onCheckedChange={checked => setCourseForm(f => ({ ...f, isPublished: checked }))}
 />
 </div>

 <div className="space-y-1.5 pt-2">
 <Label>
 Description <span className="text-muted-foreground font-normal">(Rich Text)</span>
 </Label>
 <div className="h-72 mb-10 overflow-hidden rounded-md">
 <ReactQuill
 theme="snow"
 value={courseForm.description}
 onChange={val => setCourseForm(f => ({ ...f, description: val }))}
 className="h-full"
 />
 </div>
 </div>
 </div>
 <DialogFooter>
 <Button variant="outline" onClick={() => setCourseDialog(false)}>
 Cancel
 </Button>
 <Button onClick={saveCourse} disabled={savingCourse}>
 {savingCourse ? 'Saving…' : 'Save Changes'}
 </Button>
 </DialogFooter>
 </>
 )}
 </DialogContent>
 </Dialog>
 </div>
 )
}
