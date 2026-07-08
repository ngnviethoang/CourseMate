'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import {
  Loader2,
  FileText,
  RefreshCw,
  Save,
  Download,
  Link2,
  Pencil,
  Check,
  X,
  Play,
  Layout,
  ChevronLeft,
  ChevronRight,
  Plus,
  UploadCloud,
  AlertCircle
} from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getAccessToken } from '@/lib/auth-token.util'
import { lessonMaterialService } from '@/lib/lesson-material-service'
import type { LectureOutline, LectureSlide, OutlineDto } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

type DocumentProcessedNotification = {
  lessonId?: string
  LessonId?: string
  message?: string
  Message?: string
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

// ─── Editable Slide ───────────────────────────────────────────────────────────
function EditableSlide({ slide, onChange }: { slide: LectureSlide; onChange: (updated: LectureSlide) => void }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(slide.title)

  const updateBullet = (bi: number, val: string) => {
    const bullets = [...slide.bullets]
    bullets[bi] = val
    onChange({ ...slide, bullets })
  }

  const addBullet = () => onChange({ ...slide, bullets: [...slide.bullets, ''] })
  const removeBullet = (bi: number) => onChange({ ...slide, bullets: slide.bullets.filter((_, i) => i !== bi) })

  const commitTitle = () => {
    onChange({ ...slide, title: titleDraft })
    setEditingTitle(false)
  }

  return (
    <div className="group rounded-lg border border-border bg-card hover:border-primary/30 transition-colors duration-150">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-muted/40 border-b border-border/60">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-primary bg-primary/10">
          {slide.slideNumber}
        </span>

        {editingTitle ? (
          <div className="flex-1 flex items-center gap-1.5">
            <Input
              className="h-7 text-xs font-semibold px-2"
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitTitle()
                if (e.key === 'Escape') {
                  setTitleDraft(slide.title)
                  setEditingTitle(false)
                }
              }}
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-green-600 hover:bg-green-50 shrink-0"
              onClick={commitTitle}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-destructive hover:bg-destructive/5 shrink-0"
              onClick={() => {
                setTitleDraft(slide.title)
                setEditingTitle(false)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div
            className="flex-1 flex items-center gap-1.5 text-xs font-semibold truncate cursor-pointer hover:text-primary transition-colors"
            onClick={() => setEditingTitle(true)}
          >
            <span className="truncate">
              {slide.title || <span className="text-muted-foreground/40 font-normal italic">Chưa có tiêu đề</span>}
            </span>
            <Pencil className="h-2.5 w-2.5 shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1.5">
        {slide.bullets.map((bullet, bi) => (
          <div key={bi} className="flex items-center gap-2 group/bullet">
            <div className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/30 group-hover/bullet:bg-primary/40 transition-colors" />
            <textarea
              className="flex-1 min-h-[30px] resize-none rounded border border-transparent bg-transparent hover:border-border/60 hover:bg-muted/30 focus:border-primary/40 focus:bg-background px-2 py-1 text-xs outline-none transition-all placeholder:text-muted-foreground/30 leading-relaxed"
              value={bullet}
              rows={1}
              placeholder="Ý chính..."
              onChange={e => updateBullet(bi, e.target.value)}
            />
            <button
              onClick={() => removeBullet(bi)}
              className="p-1 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover/bullet:opacity-100 transition-all shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          onClick={addBullet}
          className="flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Thêm dòng
        </button>

        {slide.relatedLinks?.length > 0 && (
          <div className="pt-2 border-t border-border/40 flex flex-wrap gap-1">
            {slide.relatedLinks.map((link, li) => (
              <Badge
                key={li}
                variant="secondary"
                className="font-normal text-[10px] h-5 bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400 border-0"
              >
                {link}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Slide Preview ────────────────────────────────────────────────────────────
function SlidePreviewer({ slides }: { slides: LectureSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(slides.length > 1)

  const syncNavigationState = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', syncNavigationState)
    emblaApi.on('reInit', syncNavigationState)
    return () => {
      emblaApi.off('select', syncNavigationState)
      emblaApi.off('reInit', syncNavigationState)
    }
  }, [emblaApi, syncNavigationState])

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-zinc-200" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] p-12 flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div className="mb-8">
                    <Badge variant="outline" className="mb-4 border-zinc-300 text-zinc-600">
                      Slide {slide.slideNumber}/{slides.length}
                    </Badge>
                    <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-zinc-950">
                      {slide.title || 'Slide chưa có tiêu đề'}
                    </h2>
                    <div className="mt-4 h-1 w-16 rounded-full bg-zinc-900" />
                  </div>
                  <div className="flex-1 space-y-4">
                    {slide.bullets.map((bullet, bi) => (
                      <div
                        key={bi}
                        className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500"
                        style={{ animationDelay: `${bi * 100}ms` }}
                      >
                        <div className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-900" />
                        <p className="text-xl font-medium leading-relaxed text-zinc-800">{bullet}</p>
                      </div>
                    ))}
                  </div>
                  {slide.relatedLinks?.length > 0 && (
                    <div className="mt-8 flex items-center gap-3 border-t border-zinc-200 pt-6">
                      <Link2 className="h-4 w-4 text-zinc-500 shrink-0" />
                      <div className="flex gap-4">
                        {slide.relatedLinks.map((link, li) => (
                          <span key={li} className="max-w-[200px] truncate text-xs text-zinc-500">
                            {link}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border-zinc-200 bg-white text-zinc-900 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity hover:bg-zinc-50"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border-zinc-200 bg-white text-zinc-900 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity hover:bg-zinc-50"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${selectedIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── PPTX Export ──────────────────────────────────────────────────────────────
async function downloadOutlineAsPptx(outline: LectureOutline) {
  const { default: PptxGenJS } = await import('pptxgenjs')
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'CourseMate'
  pptx.title = outline.lessonTitle || 'Lecture Outline'
  pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial' }

  const titleSlide = pptx.addSlide()
  titleSlide.background = { color: 'FFFFFF' }
  titleSlide.addText(outline.lessonTitle || 'Bài giảng', {
    x: 0.75,
    y: 1.1,
    w: 11.2,
    h: 0.8,
    fontFace: 'Arial',
    fontSize: 24,
    bold: true,
    color: '111111',
    align: 'left'
  })
  titleSlide.addShape('line', { x: 0.75, y: 2.05, w: 2.2, h: 0, line: { color: '111111', width: 1.5 } })
  ;(outline.slides ?? []).forEach((slideContent, index) => {
    const slide = pptx.addSlide()
    slide.background = { color: 'FFFFFF' }
    slide.addText(`Slide ${slideContent.slideNumber || index + 1}`, {
      x: 0.75,
      y: 0.45,
      w: 2,
      h: 0.3,
      fontFace: 'Arial',
      fontSize: 10,
      color: '666666',
      bold: true
    })
    slide.addText(slideContent.title || `Phần ${index + 1}`, {
      x: 0.75,
      y: 0.9,
      w: 11.1,
      h: 0.7,
      fontFace: 'Arial',
      fontSize: 22,
      bold: true,
      color: '111111'
    })
    slide.addShape('line', { x: 0.75, y: 1.7, w: 2, h: 0, line: { color: '111111', width: 1.25 } })
    slide.addText(
      (slideContent.bullets ?? []).map(bullet => ({
        text: `• ${bullet || 'Nội dung đang cập nhật'}`,
        options: { breakLine: true, color: '222222' }
      })),
      { x: 1, y: 2.1, w: 10.4, h: 3.9, fontFace: 'Arial', fontSize: 19, margin: 0, valign: 'top' }
    )
    const links = (slideContent.relatedLinks ?? []).filter(Boolean)
    if (links.length > 0) {
      slide.addText(`Tài liệu liên quan: ${links.join('   ')}`, {
        x: 0.9,
        y: 6.35,
        w: 10.6,
        h: 0.45,
        fontFace: 'Arial',
        fontSize: 9,
        color: '666666'
      })
    }
  })

  const fileName = `${(outline.lessonTitle || 'slide-outline').trim().replace(/[\\/:*?"<>|]+/g, '-')}.pptx`
  await pptx.writeFile({ fileName })
}

// ─── Outline Editor ───────────────────────────────────────────────────────────
function OutlineEditor({
  outline,
  lessonId,
  materialId,
  onSaved
}: {
  outline: LectureOutline
  lessonId: string
  materialId: string
  onSaved: (updated: OutlineDto) => void
}) {
  const [draft, setDraft] = useState<LectureOutline>(outline)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<'edit' | 'preview'>('edit')

  const updateSlide = useCallback((index: number, updated: LectureSlide) => {
    setDraft(prev => ({ ...prev, slides: prev.slides.map((s, i) => (i === index ? updated : s)) }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await lessonMaterialService.updateOutline(lessonId, {
        lessonMaterialId: materialId,
        lectureOutline: draft
      })
      toast.success('Đã lưu dàn ý thành công.')
      onSaved(result)
    } catch {
      toast.error('Không thể lưu dàn ý.')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPptx = async () => {
    try {
      await downloadOutlineAsPptx(draft)
      toast.success('Đã tạo file PPTX.')
    } catch {
      toast.error('Không thể tạo file PPTX.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <Button
            variant={view === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-md gap-1.5 h-8"
            onClick={() => setView('edit')}
          >
            <Layout className="h-3.5 w-3.5" />
            Soạn thảo
          </Button>
          <Button
            variant={view === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-md gap-1.5 h-8"
            onClick={() => setView('preview')}
          >
            <Play className="h-3.5 w-3.5" />
            Xem trước
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadPptx}>
            <Download className="h-3.5 w-3.5" />
            Tải PPTX
          </Button>
          {view === 'edit' && (
            <Button type="button" onClick={handleSave} disabled={saving} size="sm" className="gap-1.5">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          )}
        </div>
      </div>

      {view === 'preview' ? (
        <SlidePreviewer slides={draft.slides} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-purple-200/60 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-950/30 px-4 py-3">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 shrink-0"></div>
            <Input
              className="flex-1 border-0 bg-transparent p-0 h-auto text-base font-bold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
              value={draft.lessonTitle}
              placeholder="Nhập tiêu đề bài học..."
              onChange={e => setDraft(prev => ({ ...prev, lessonTitle: e.target.value }))}
            />
            <Badge className="bg-purple-500 hover:bg-purple-500 text-white border-0 shrink-0">
              {draft.slides.length} slide
            </Badge>
          </div>

          <div className="space-y-1.5">
            {draft.slides.map((slide, i) => (
              <EditableSlide key={slide.slideNumber} slide={slide} onChange={updated => updateSlide(i, updated)} />
            ))}
          </div>

          {draft.relatedLinks?.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Link2 className="h-3.5 w-3.5" /> Tài liệu liên quan
              </p>
              <div className="grid grid-cols-2 gap-2">
                {draft.relatedLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-background border border-border hover:border-primary/50 hover:shadow-sm transition-all group"
                  >
                    <div className="h-7 w-7 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                      <Link2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium truncate flex-1">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AiMaterialSection({ lessonId }: { lessonId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const notificationConnectionRef = useRef<HubConnection | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [outline, setOutline] = useState<OutlineDto | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const hasSlides = useCallback((result: OutlineDto | null | undefined) => {
    return (result?.lectureOutline?.slides?.length ?? 0) > 0
  }, [])

  const loadOutline = useCallback(async () => {
    const result = await lessonMaterialService.getOutline(lessonId)
    if (hasSlides(result)) {
      setOutline(result)
      setUploadState('done')
      return true
    }
    return false
  }, [hasSlides, lessonId])

  useEffect(() => {
    void loadOutline().catch(() => {})
  }, [loadOutline])

  useEffect(() => {
    if (!API_BASE_URL) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notification`, {
        accessTokenFactory: () => getAccessToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    notificationConnectionRef.current = connection

    connection.on('DocumentProcessed', (notification: DocumentProcessedNotification) => {
      const notificationLessonId = notification?.lessonId ?? notification?.LessonId
      if (notificationLessonId && notificationLessonId.toLowerCase() !== lessonId.toLowerCase()) return

      const loweredMessage = (notification?.message ?? notification?.Message ?? '').toLowerCase()
      if (loweredMessage.includes('thất bại') || loweredMessage.includes('failed')) {
        setUploadState('error')
        toast.error('Tạo dàn ý thất bại. Vui lòng thử lại với tài liệu khác.')
        return
      }

      void loadOutline()
        .then(loaded => {
          if (loaded) {
            setSelectedFile(null)
            toast.success('Dàn ý bài giảng đã sẵn sàng.')
          }
        })
        .catch(() => toast.error('Không thể đồng bộ dàn ý mới nhất.'))
    })

    void connection.start().catch(() => {})

    return () => {
      connection.off('DocumentProcessed')
      if (notificationConnectionRef.current === connection) notificationConnectionRef.current = null
      void connection.stop().catch(() => {})
    }
  }, [lessonId, loadOutline])

  const startGeneration = async () => {
    if (!selectedFile) return
    setUploadState('uploading')
    try {
      await lessonMaterialService.uploadMaterial(lessonId, selectedFile, 'BulletSlide')
      setUploadState('processing')
      toast.info('File đã tải lên. Hệ thống sẽ tự đồng bộ khi xử lý xong.')
    } catch {
      setUploadState('error')
      toast.error('Tải tệp lên thất bại. Vui lòng thử lại.')
    }
  }

  const handleFileSelect = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['doc', 'docx', 'pdf'].includes(ext ?? '')) {
      toast.error('Chỉ hỗ trợ tệp .doc, .docx và .pdf.')
      return
    }
    setSelectedFile(file)
    setUploadState('idle')
  }

  const handleManualRefresh = async () => {
    try {
      const result = await lessonMaterialService.getOutline(lessonId)
      if ((result?.lectureOutline?.slides?.length ?? 0) > 0) {
        setOutline(result)
        setUploadState('done')
        toast.success('Dàn ý đã được tải.')
      } else if (result?.lessonMaterialId) {
        setUploadState('processing')
        toast.info('Tài liệu đang được xử lý.')
      } else {
        toast.info('Chưa có dữ liệu slide cho bài học này.')
      }
    } catch {
      toast.error('Không thể tải dàn ý.')
    }
  }

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40"></div>
          <div>
            <p className="text-sm font-semibold">Hỗ trợ soạn thảo bài giảng</p>
            <p className="text-xs text-muted-foreground">Tải file Word/PDF để tự động tạo dàn ý slide</p>
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {uploadState === 'processing' ? 'Kiểm tra' : 'Làm mới'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Hidden file input — always mounted so fileRef stays valid */}
        <input
          ref={fileRef}
          type="file"
          accept=".doc,.docx,.pdf"
          className="sr-only"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
            e.target.value = ''
          }}
        />

        {/* Idle / Error */}
        {(uploadState === 'idle' || uploadState === 'error') && (
          <>
            {!selectedFile ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={e => {
                  e.preventDefault()
                  const f = e.dataTransfer.files[0]
                  if (f) handleFileSelect(f)
                }}
                onDragOver={e => e.preventDefault()}
                className={[
                  'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-150',
                  uploadState === 'error'
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                ].join(' ')}
              >
                <div className="p-3 rounded-full bg-muted">
                  <UploadCloud className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Tải lên tài liệu nguồn</p>
                  <p className="text-xs text-muted-foreground">Hỗ trợ .doc, .docx và .pdf</p>
                </div>
                {uploadState === 'error' && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Có lỗi xảy ra. Vui lòng thử lại.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3.5">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="gap-2 flex-1" onClick={startGeneration}>
                    Tạo bài giảng hỗ trợ
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground shrink-0"
                    onClick={() => fileRef.current?.click()}
                  >
                    Đổi file
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Uploading */}
        {uploadState === 'uploading' && (
          <div className="flex items-center justify-center gap-3 py-10 animate-in fade-in duration-200">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Đang tải tài liệu lên...</span>
          </div>
        )}

        {/* Processing */}
        {uploadState === 'processing' && (
          <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-5 animate-in fade-in duration-200">
            <div className="relative shrink-0">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30"></div>
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">AI đang tạo bài giảng</p>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                Đang phân tích và trích xuất các ý chính từ tài liệu
              </p>
            </div>
          </div>
        )}

        {/* Done */}
        {uploadState === 'done' && outline && (
          <OutlineEditor
            outline={outline.lectureOutline}
            lessonId={lessonId}
            materialId={outline.lessonMaterialId}
            onSaved={updated => setOutline(updated)}
          />
        )}
      </div>
    </div>
  )
}
