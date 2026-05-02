'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Upload,
  Loader2,
  Sparkles,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Save,
  Link2,
  Pencil,
  Check,
  X,
  Play,
  Layout,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus
} from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { lessonMaterialService } from '@/lib/lesson-material-service'
import type { LectureOutline, LectureSlide, OutlineDto } from '@/lib/types'

// ─── Types ───────────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

// ─── Editable Slide ───────────────────────────────────────────────────────────
function EditableSlide({
  slide,
  index,
  onChange
}: {
  slide: LectureSlide
  index: number
  onChange: (updated: LectureSlide) => void
}) {
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
    <div className="group border rounded-2xl overflow-hidden bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      {/* Slide header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-muted/30 border-b group-hover:bg-muted/50 transition-colors">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold shadow-inner border border-primary/20">
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
            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => { onChange({ ...slide, title: titleDraft }); setEditingTitle(false) }}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/5" onClick={() => { setTitleDraft(slide.title); setEditingTitle(false) }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex-1 text-sm font-bold truncate cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => setEditingTitle(true)}
          >
            {slide.title || <span className="text-muted-foreground/50 font-normal italic">Untitled slide</span>}
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
                  className="flex-1 min-h-[44px] resize-none rounded-xl border border-transparent bg-muted/20 hover:border-muted-foreground/10 focus:border-primary/30 focus:bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/30"
                  value={bullet}
                  rows={1}
                  placeholder="Slide point..."
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
              Add Bullet Point
            </button>
          </div>

          {slide.relatedLinks?.length > 0 && (
            <div className="pt-4 border-t border-dashed space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Link2 className="h-3 w-3" /> Related Context
              </p>
              <div className="flex flex-wrap gap-2">
                {slide.relatedLinks.map((link, li) => (
                  <Badge key={li} variant="secondary" className="font-normal text-[10px] bg-blue-50/50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400 border-0">
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

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="overflow-hidden rounded-2xl border bg-zinc-950 shadow-2xl" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] p-12 flex flex-col">
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8">
                    <Badge variant="outline" className="text-zinc-500 border-zinc-800 mb-4">
                      Slide {slide.slideNumber} of {slides.length}
                    </Badge>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {slide.title || "Untitled Slide"}
                    </h2>
                    <div className="h-1.5 w-24 bg-primary rounded-full mt-4" />
                  </div>

                  <div className="flex-1 space-y-4">
                    {slide.bullets.map((bullet, bi) => (
                      <div key={bi} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${bi * 100}ms` }}>
                        <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        <p className="text-xl text-zinc-300 font-medium leading-relaxed">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>

                  {slide.relatedLinks?.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-3">
                      <Link2 className="h-4 w-4 text-zinc-500" />
                      <div className="flex gap-4">
                        {slide.relatedLinks.map((link, li) => (
                          <span key={li} className="text-xs text-zinc-500 truncate max-w-[200px]">
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
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Thumbnails / Progress */}
      <div className="flex flex-wrap justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 transition-all rounded-full ${selectedIndex === i ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
          />
        ))}
      </div>
    </div>
  )
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
      toast.success('Outline saved successfully!')
      onSaved(result)
    } catch {
      toast.error('Failed to save outline.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex bg-muted/50 p-1 rounded-xl border">
          <Button
            variant={view === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-lg gap-2"
            onClick={() => setView('edit')}
          >
            <Layout className="h-4 w-4" />
            Designer
          </Button>
          <Button
            variant={view === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-lg gap-2"
            onClick={() => setView('preview')}
          >
            <Play className="h-4 w-4" />
            Live Preview
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {view === 'edit' && (
            <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      {view === 'preview' ? (
        <SlidePreviewer slides={draft.slides} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Title Card */}
          <div className="relative group overflow-hidden rounded-2xl border bg-muted/30 p-6 shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-24 w-24 text-purple-500" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em] mb-1">Generated Lesson</p>
                <Input
                  className="border-0 bg-transparent p-0 h-auto text-2xl font-black shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/30"
                  value={draft.lessonTitle}
                  placeholder="Enter lesson title..."
                  onChange={e => setDraft(prev => ({ ...prev, lessonTitle: e.target.value }))}
                />
              </div>
              <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 px-3 py-1 rounded-full shadow-md shadow-purple-500/20 shrink-0">
                {draft.slides.length} slides
              </Badge>
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-4">
            {draft.slides.map((slide, i) => (
              <EditableSlide
                key={slide.slideNumber}
                slide={slide}
                index={i}
                onChange={updated => updateSlide(i, updated)}
              />
            ))}
          </div>

          {/* Resources */}
          {draft.relatedLinks?.length > 0 && (
            <div className="rounded-2xl border bg-muted/20 p-6 space-y-4">
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-background border hover:border-primary/50 hover:shadow-md transition-all group"
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
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [outline, setOutline] = useState<OutlineDto | null>(null)
  const [materialId, setMaterialId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pollingCount, setPollingCount] = useState(0)

  // Poll for outline after upload
  const pollOutline = useCallback(
    async (lessonId: string, attempts = 0, maxAttempts = 40) => {
      if (attempts >= maxAttempts) {
        setUploadState('error')
        toast.error('Quá trình hỗ trợ làm bài giảng đã quá thời gian. Vui lòng thử lại.')
        return
      }
      try {
        const result = await lessonMaterialService.getOutline(lessonId)
        const hasSlides = result?.lectureOutline?.slides?.length || 0 > 0
        if (hasSlides) {
          setOutline(result)
          setUploadState('done')
          toast.success('Dàn ý bài giảng đã sẵn sàng! 🎉')
          return
        }
      } catch {
        // Ignore errors while polling — outline may not be ready yet
      }
      setPollingCount(attempts + 1)
      setTimeout(() => pollOutline(lessonId, attempts + 1, maxAttempts), 3000)
    },
    []
  )

  // ── On mount: check if AI is already running or done for this lesson ──────
  // This handles the case where file was uploaded from the chapter modal
  // and user was redirected here — we resume the correct state automatically.
  useEffect(() => {
    if (!lessonId) return
    let cancelled = false

    const checkExistingOutline = async () => {
      try {
        const result = await lessonMaterialService.getOutline(lessonId)
        if (cancelled) return

        const hasSlides = result?.lectureOutline?.slides?.length || 0 > 0
        const hasMaterial = result?.lessonMaterialId

        if (hasSlides) {
          // AI already finished → show editor immediately
          setOutline(result)
          setMaterialId(result?.lessonMaterialId ?? '')
          setUploadState('done')
        } else if (hasMaterial) {
          // Material exists but AI still processing → resume polling
          setMaterialId(result.lessonMaterialId)
          setUploadState('processing')
          pollOutline(lessonId)
        }
        // else: no material yet → stay idle (show drop zone)
      } catch {
        // API returned empty / error → lesson has no material yet, stay idle
      }
    }

    checkExistingOutline()
    return () => { cancelled = true }
  }, [lessonId, pollOutline])

  const startGeneration = async () => {
    if (!selectedFile) return
    setUploadState('uploading')
    try {
      const result = await lessonMaterialService.uploadMaterial(lessonId, selectedFile)
      setMaterialId(result.lessonMaterialId)
      setUploadState('processing')
      toast.info('File đã tải lên! Hệ thống đang bắt đầu phân tích nội dung...')
      pollOutline(lessonId)
    } catch {
      setUploadState('error')
      toast.error('Upload failed. Please try again.')
    }
  }

  const handleFileSelect = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['doc', 'docx', 'pdf'].includes(ext ?? '')) {
      toast.error('Only .doc, .docx, and .pdf files are supported.')
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
      } else {
        toast.info('Hệ thống vẫn đang xử lý. Vui lòng chờ trong giây lát.')
      }
    } catch {
      toast.error('Could not fetch outline.')
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Hỗ trợ soạn thảo bài giảng</h3>
            <p className="text-xs text-muted-foreground">Tải file Word/PDF để tự động tạo dàn ý bài học</p>
          </div>
        </div>
        {uploadState === 'processing' && (
          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Idle / Selected File */}
        {(uploadState === 'idle' || uploadState === 'error') && (
          <div className="space-y-6">
            {!selectedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="group border-2 border-dashed border-muted-foreground/20 rounded-2xl py-16 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-purple-400/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all duration-300"
                onClick={() => fileRef.current?.click()}
              >
                <div className="h-16 w-16 rounded-3xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div className="max-w-xs">
                  <p className="font-bold text-lg tracking-tight">Tải lên tài liệu nguồn</p>
                  <p className="text-sm text-muted-foreground mt-1">Hệ thống sẽ hỗ trợ trích xuất các ý chính và tạo slide cho bạn.</p>
                  <p className="text-[10px] font-medium text-muted-foreground/60 mt-4 uppercase tracking-[0.2em]">Hỗ trợ PDF, DOCX</p>
                </div>
                {uploadState === 'error' && (
                  <Badge variant="destructive" className="mt-2">Something went wrong. Try again.</Badge>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="relative group overflow-hidden rounded-2xl border bg-muted/20 p-6 shadow-sm border-purple-100 dark:border-purple-900/20">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-purple-100 dark:border-purple-900/30 shrink-0">
                      <FileText className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate pr-8">{selectedFile.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="secondary" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 border-0">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Ready to process</span>
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

                  <div className="mt-8 pt-6 border-t border-purple-100/50 dark:border-purple-900/20 flex flex-col sm:flex-row items-center gap-4">
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
              <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-background border-4 border-purple-500 flex items-center justify-center shadow-lg">
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
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-1 w-1 bg-white rounded-full opacity-40 animate-ping"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${1 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center space-y-3 max-w-md">
              <h3 className="font-black text-3xl tracking-tighter text-primary">
                Đang hỗ trợ soạn thảo bài giảng
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed px-4">
                Chúng tôi đang phân tích cấu trúc, trích xuất các điểm chính và thiết kế các slide.
                Quá trình này thường mất khoảng một phút.
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
                  Attempt {pollingCount}
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
