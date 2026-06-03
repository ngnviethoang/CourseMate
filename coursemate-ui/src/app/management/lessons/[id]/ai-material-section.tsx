'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import {
  Upload,
  Loader2,
  Sparkles,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
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
  Plus
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

// ─── Types ───────────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

const PROCESSING_PARTICLES = [
  { top: '12%', left: '18%', duration: '1.2s' },
  { top: '24%', left: '76%', duration: '1.8s' },
  { top: '42%', left: '58%', duration: '1.4s' },
  { top: '61%', left: '22%', duration: '2s' },
  { top: '73%', left: '68%', duration: '1.6s' },
  { top: '86%', left: '44%', duration: '1.3s' }
] as const

// ─── Editable Slide ───────────────────────────────────────────────────────────
function EditableSlide({ slide, onChange }: { slide: LectureSlide; onChange: (updated: LectureSlide) => void }) {
  const [expanded, setExpanded] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(slide.title)

  const updateBullet = (bi: number, val: string) => {
    const bullets = [...slide.bullets]
    bullets[bi] = val
    onChange({ ...slide, bullets })
  }

  const addBullet = () => {
    onChange({ ...slide, bullets: [...slide.bullets, ''] })
  }

  const removeBullet = (bi: number) => {
    onChange({ ...slide, bullets: slide.bullets.filter((_, i) => i !== bi) })
  }

  return (
    <div className="group rounded-2xl overflow-hidden bg-card hover:-primary/30 hover:shadow-lg transition-all duration-300">
      {/* Slide header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-muted/30 shadow-md border-0 border-b-0 group-hover:bg-muted/50 transition-colors">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold shadow-inner -primary/20">
          {slide.slideNumber}
        </div>
        {editingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              className="h-9 text-sm font-semibold"
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onChange({ ...slide, title: titleDraft })
                  setEditingTitle(false)
                }
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
              className="h-8 w-8 text-green-600 hover:bg-green-50"
              onClick={() => {
                onChange({ ...slide, title: titleDraft })
                setEditingTitle(false)
              }}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:bg-destructive/5"
              onClick={() => {
                setTitleDraft(slide.title)
                setEditingTitle(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex-1 text-sm font-bold truncate cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => setEditingTitle(true)}
          >
            {slide.title || <span className="text-muted-foreground/50 font-normal italic">Slide chưa có tiêu đề</span>}
            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
        )}
        <button
          onClick={() => setExpanded(e => !e)}
          className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-all"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Slide body */}
      {expanded && (
        <div className="p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            {slide.bullets.map((bullet, bi) => (
              <div key={bi} className="flex items-start gap-3 group/bullet">
                <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 group-hover/bullet:bg-primary transition-colors" />
                <textarea
                  className="flex-1 min-h-[44px] resize-none rounded-xl border-transparent bg-muted/20 hover:-muted-foreground/10 focus:-primary/30 focus:bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/30"
                  value={bullet}
                  rows={1}
                  placeholder="Ý chính của slide..."
                  onChange={e => updateBullet(bi, e.target.value)}
                />
                <button
                  onClick={() => removeBullet(bi)}
                  className="mt-2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover/bullet:opacity-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={addBullet}
              className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm gạch đầu dòng
            </button>
          </div>

          {slide.relatedLinks?.length > 0 && (
            <div className="pt-4 shadow-md border-0 border-t-0 -dashed space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Link2 className="h-3 w-3" /> Tài liệu liên quan
              </p>
              <div className="flex flex-wrap gap-2">
                {slide.relatedLinks.map((link, li) => (
                  <Badge
                    key={li}
                    variant="secondary"
                    className="font-normal text-[10px] bg-blue-50/50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400 border-0"
                  >
                    {link}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Slide Preview (The WOW factor) ──────────────────────────────────────────
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
    <div className="space-y-6">
      <div className="relative group">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] p-12 flex flex-col">
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <Badge variant="outline" className="mb-4 border-zinc-300 text-zinc-600">
                      Slide {slide.slideNumber}/{slides.length}
                    </Badge>
                    <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-zinc-950">
                      {slide.title || 'Slide chưa có tiêu đề'}
                    </h2>
                    <div className="mt-4 h-1 w-24 rounded-full bg-zinc-900" />
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
                      <Link2 className="h-4 w-4 text-zinc-500" />
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

        {/* Navigation Buttons */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border-zinc-200 bg-white text-zinc-900 shadow-sm opacity-0 transition-opacity hover:bg-zinc-50 group-hover:opacity-100 disabled:opacity-40 disabled:hover:bg-white"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-zinc-200 bg-white text-zinc-900 shadow-sm opacity-0 transition-opacity hover:bg-zinc-50 group-hover:opacity-100 disabled:opacity-40 disabled:hover:bg-white"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Thumbnails / Progress */}
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 transition-all rounded-full ${selectedIndex === i ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

async function downloadOutlineAsPptx(outline: LectureOutline) {
  const { default: PptxGenJS } = await import('pptxgenjs')

  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'CourseMate'
  pptx.company = 'CourseMate'
  pptx.subject = outline.lessonTitle || 'Lecture Outline'
  pptx.title = outline.lessonTitle || 'Lecture Outline'
  pptx.lang = 'vi-VN'
  pptx.theme = {
    headFontFace: 'Arial',
    bodyFontFace: 'Arial',
    lang: 'vi-VN'
  }

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
  titleSlide.addShape('line', {
    x: 0.75,
    y: 2.05,
    w: 2.2,
    h: 0,
    line: { color: '111111', width: 1.5 }
  })
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
    slide.addShape('line', {
      x: 0.75,
      y: 1.7,
      w: 2,
      h: 0,
      line: { color: '111111', width: 1.25 }
    })

    slide.addText(
      (slideContent.bullets ?? []).map(bullet => ({
        text: `• ${bullet || 'Nội dung đang cập nhật'}`,
        options: {
          breakLine: true,
          color: '222222'
        }
      })),
      {
        x: 1,
        y: 2.1,
        w: 10.4,
        h: 3.9,
        fontFace: 'Arial',
        fontSize: 19,
        margin: 0,
        valign: 'top'
      }
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

// ─── Outline Editor ────────────────────────────────────────────────────────────
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
    setDraft(prev => ({
      ...prev,
      slides: prev.slides.map((s, i) => (i === index ? updated : s))
    }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await lessonMaterialService.updateOutline(lessonId, {
        lessonMaterialId: materialId,
        lectureOutline: draft
      })
      toast.success('Đã lưu dàn ý thành công!')
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
      toast.success('Đã tạo file PPTX từ dàn ý hiện tại.')
    } catch {
      toast.error('Không thể tạo file PPTX.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <Button
            variant={view === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-lg gap-2"
            onClick={() => setView('edit')}
          >
            <Layout className="h-4 w-4" />
            Soạn thảo
          </Button>
          <Button
            variant={view === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-lg gap-2"
            onClick={() => setView('preview')}
          >
            <Play className="h-4 w-4" />
            Xem trước trực tiếp
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleDownloadPptx}>
            <Download className="h-4 w-4" />
            Tải slide
          </Button>
          {view === 'edit' && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          )}
        </div>
      </div>

      {view === 'preview' ? (
        <SlidePreviewer slides={draft.slides} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Title Card */}
          <div className="relative group overflow-hidden rounded-2xl bg-muted shadow-md border-0 border-0/30 p-6 shadow-md border-0">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-24 w-24 text-purple-500" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em] mb-1">
                  Bài giảng đã tạo
                </p>
                <Input
                  className="-0 bg-transparent p-0 h-auto text-2xl font-black shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/30"
                  value={draft.lessonTitle}
                  placeholder="Nhập tiêu đề bài học..."
                  onChange={e => setDraft(prev => ({ ...prev, lessonTitle: e.target.value }))}
                />
              </div>
              <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 px-3 py-1 rounded-full shadow-md shadow-purple-500/20 shrink-0">
                {draft.slides.length} slide
              </Badge>
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-4">
            {draft.slides.map((slide, i) => (
              <EditableSlide key={slide.slideNumber} slide={slide} onChange={updated => updateSlide(i, updated)} />
            ))}
          </div>

          {/* Resources */}
          {draft.relatedLinks?.length > 0 && (
            <div className="rounded-2xl bg-muted shadow-md border-0 border-0/20 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Related Resources
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draft.relatedLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-background hover:-primary/50 hover:shadow-md transition-all group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium truncate flex-1">{link}</span>
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

// ─── Main Component ────────────────────────────────────────────────────────────
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
      if (notificationLessonId && notificationLessonId !== lessonId) return

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
        .catch(() => {
          toast.error('Không thể đồng bộ dàn ý mới nhất.')
        })
    })

    const startConnection = async () => {
      try {
        await connection.start()
      } catch {
        // Keep manual refresh available if realtime is unavailable.
      }
    }
    void startConnection()

    return () => {
      connection.off('DocumentProcessed')
      if (notificationConnectionRef.current === connection) {
        notificationConnectionRef.current = null
      }
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleManualRefresh = async () => {
    if (!lessonId) return
    try {
      const result = await lessonMaterialService.getOutline(lessonId)
      if (result?.lectureOutline?.slides?.length || 0 > 0) {
        setOutline(result)
        setUploadState('done')
        toast.success('Dàn ý đã được tải!')
      } else if (result?.lessonMaterialId) {
        setUploadState('processing')
        toast.info('Tài liệu đang được xử lý. Hệ thống sẽ cập nhật khi hoàn tất.')
      } else {
        toast.info('Chưa có dữ liệu slide được tạo cho bài học này.')
      }
    } catch {
      toast.error('Không thể tải dàn ý.')
    }
  }

  return (
    <div className="rounded-xl bg-card shadow-md border-0 shadow-md border-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shadow-md border-0 border-b-0 bg-muted/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Hỗ trợ soạn thảo bài giảng</h3>
            <p className="text-xs text-muted-foreground">Tải file Word/PDF để tự động tạo dàn ý bài học</p>
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {uploadState === 'processing' ? 'Kiểm tra lại' : 'Tải dữ liệu AI'}
        </button>
      </div>

      <div className="p-6">
        {/* Idle / Selected File */}
        {(uploadState === 'idle' || uploadState === 'error') && (
          <div className="space-y-6">
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="group -2 -dashed -muted-foreground/20 rounded-2xl py-16 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:-purple-400/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all duration-300"
                onClick={() => fileRef.current?.click()}
              >
                <div className="h-16 w-16 rounded-3xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-lg tracking-tight">Tải lên tài liệu nguồn</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Hệ thống sẽ hỗ trợ trích xuất các ý chính và tạo slide cho bạn.
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground/60 mt-4 uppercase tracking-[0.2em]">
                    Hỗ trợ PDF, DOCX
                  </p>
                </div>
                {uploadState === 'error' && (
                  <Badge variant="destructive" className="mt-2">
                    Có lỗi xảy ra. Vui lòng thử lại.
                  </Badge>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="relative group overflow-hidden rounded-2xl bg-muted shadow-md border-0 border-0/20 p-6 shadow-md border-0 -purple-100 dark:-purple-900/20">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-md border-0 flex items-center justify-center -purple-100 dark:-purple-900/30 shrink-0">
                      <FileText className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate pr-8">{selectedFile.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge
                          variant="secondary"
                          className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 border-0"
                        >
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                          Sẵn sàng xử lý
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-8 pt-6 shadow-md border-0 border-t-0 -purple-100/50 dark:-purple-900/20 flex flex-col sm:flex-row items-center gap-4">
                    <Button
                      className="w-full sm:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 gap-3"
                      onClick={startGeneration}
                    >
                      <Sparkles className="h-5 w-5" />
                      Tạo bài giảng hỗ trợ
                    </Button>
                    <button
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      onClick={() => fileRef.current?.click()}
                    >
                      Chọn file khác
                    </button>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".doc,.docx,.pdf"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ''
              }}
            />
          </div>
        )}

        {/* Uploading */}
        {uploadState === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-20 gap-6 animate-in fade-in duration-500">
            <div className="relative">
              <div className="h-24 w-24 rounded-[2rem] bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Upload className="h-10 w-10 text-purple-600 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-background -4 -purple-500 flex items-center justify-center shadow-lg">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-black text-2xl tracking-tight">Đang tải tài liệu</h3>
              <p className="text-muted-foreground">Chuẩn bị tài liệu để hỗ trợ làm bài giảng...</p>
            </div>
          </div>
        )}

        {/* Processing */}
        {uploadState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 gap-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="relative h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-xl group overflow-hidden">
                <Sparkles className="h-14 w-14 text-white animate-pulse" />
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {PROCESSING_PARTICLES.map((p, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 bg-white rounded-full opacity-40 animate-ping"
                      style={{
                        top: p.top,
                        left: p.left,
                        animationDuration: p.duration
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h3 className="font-black text-3xl tracking-tighter text-primary">Đang hỗ trợ soạn thảo bài giảng</h3>
              <p className="text-muted-foreground text-sm leading-relaxed px-4">
                Chúng tôi đang phân tích cấu trúc, trích xuất các điểm chính và thiết kế các slide. Quá trình này thường
                mất khoảng một phút.
              </p>
              <div className="flex flex-col items-center gap-3 pt-4">
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.3em]">
                  Đang chờ cập nhật realtime
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Done — Outline Editor */}
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
