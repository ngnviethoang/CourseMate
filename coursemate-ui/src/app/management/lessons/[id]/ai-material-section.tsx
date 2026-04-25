'use client'

import { useCallback, useRef, useState } from 'react'
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
  X
} from 'lucide-react'
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
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Slide header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
          {slide.slideNumber}
        </div>
        {editingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              className="h-7 text-sm py-0"
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
            <button
              onClick={() => { onChange({ ...slide, title: titleDraft }); setEditingTitle(false) }}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setTitleDraft(slide.title); setEditingTitle(false) }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex-1 text-sm font-semibold truncate cursor-pointer hover:text-primary"
            onClick={() => setEditingTitle(true)}
          >
            {slide.title || <span className="text-muted-foreground italic">Untitled slide</span>}
          </div>
        )}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-muted-foreground hover:text-foreground"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Slide body */}
      {expanded && (
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            {slide.bullets.map((bullet, bi) => (
              <div key={bi} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                <textarea
                  className="flex-1 min-h-[36px] resize-none rounded-md border border-transparent bg-muted/30 hover:border-muted-foreground/20 focus:border-primary/40 focus:bg-background px-2 py-1.5 text-sm outline-none transition-all"
                  value={bullet}
                  rows={1}
                  onChange={e => updateBullet(bi, e.target.value)}
                />
                <button
                  onClick={() => removeBullet(bi)}
                  className="mt-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addBullet}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            + Add bullet
          </button>

          {slide.relatedLinks?.length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Link2 className="h-3 w-3" /> Related links
              </p>
              {slide.relatedLinks.map((link, li) => (
                <a
                  key={li}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-blue-500 hover:underline truncate"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
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
      toast.success('Outline saved!')
      onSaved(result)
    } catch {
      toast.error('Failed to save outline.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-3 p-4 rounded-xl border bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <Sparkles className="h-5 w-5 text-purple-500 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-0.5">Lesson Title</p>
          <Input
            className="border-0 bg-transparent p-0 h-auto text-lg font-bold shadow-none focus-visible:ring-0"
            value={draft.lessonTitle}
            onChange={e => setDraft(prev => ({ ...prev, lessonTitle: e.target.value }))}
          />
        </div>
        <Badge className="bg-purple-100 text-purple-700 border-0 shrink-0">
          {draft.slides.length} slides
        </Badge>
      </div>

      {/* Slides */}
      <div className="space-y-3">
        {draft.slides.map((slide, i) => (
          <EditableSlide
            key={slide.slideNumber}
            slide={slide}
            index={i}
            onChange={updated => updateSlide(i, updated)}
          />
        ))}
      </div>

      {/* Related links (lesson level) */}
      {draft.relatedLinks?.length > 0 && (
        <div className="rounded-xl border p-4 space-y-2">
          <p className="text-sm font-medium flex items-center gap-1.5">
            <Link2 className="h-4 w-4" /> Related Resources
          </p>
          {draft.relatedLinks.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-blue-500 hover:underline truncate"
            >
              {link}
            </a>
          ))}
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save Outline'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AiMaterialSection({ lessonId }: { lessonId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [outline, setOutline] = useState<OutlineDto | null>(null)
  const [materialId, setMaterialId] = useState<string | null>(null)
  const [pollingCount, setPollingCount] = useState(0)

  // Poll for outline after upload
  const pollOutline = useCallback(
    async (lessonId: string, attempts = 0, maxAttempts = 40) => {
      if (attempts >= maxAttempts) {
        setUploadState('error')
        toast.error('AI processing timed out. Please try again.')
        return
      }
      try {
        const result = await lessonMaterialService.getOutline(lessonId)
        const hasSlides = result?.lectureOutline?.slides?.length > 0
        if (hasSlides) {
          setOutline(result)
          setUploadState('done')
          toast.success('AI outline is ready! 🎉')
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

        const hasSlides = result?.lectureOutline?.slides?.length > 0
        const hasMaterial = result?.lessonMaterialId

        if (hasSlides) {
          // AI already finished → show editor immediately
          setOutline(result)
          setMaterialId(result.lessonMaterialId)
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

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['doc', 'docx', 'pdf'].includes(ext ?? '')) {
      toast.error('Only .doc, .docx, and .pdf files are supported.')
      return
    }

    setUploadState('uploading')
    try {
      const result = await lessonMaterialService.uploadMaterial(lessonId, file)
      setMaterialId(result.lessonMaterialId)
      setUploadState('processing')
      toast.info('File uploaded! AI is generating outline…')
      pollOutline(lessonId)
    } catch {
      setUploadState('error')
      toast.error('Upload failed. Please try again.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleManualRefresh = async () => {
    if (!lessonId) return
    try {
      const result = await lessonMaterialService.getOutline(lessonId)
      if (result?.lectureOutline?.slides?.length > 0) {
        setOutline(result)
        setUploadState('done')
        toast.success('Outline loaded!')
      } else {
        toast.info('AI is still processing. Please wait a moment.')
      }
    } catch {
      toast.error('Could not fetch outline.')
    }
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Slide Outline Generator</h3>
            <p className="text-xs text-muted-foreground">Upload a Word/PDF file to auto-generate lesson outline</p>
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
        {/* Idle — drop zone */}
        {(uploadState === 'idle' || uploadState === 'error') && (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-muted-foreground/20 rounded-xl py-12 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:border-purple-400/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all"
            onClick={() => fileRef.current?.click()}
          >
            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-semibold text-sm">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports .doc, .docx, .pdf</p>
            </div>
            {uploadState === 'error' && (
              <Badge variant="destructive" className="text-xs">Upload failed — try again</Badge>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".doc,.docx,.pdf"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
                e.target.value = ''
              }}
            />
          </div>
        )}

        {/* Uploading */}
        {uploadState === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Upload className="h-7 w-7 text-purple-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 flex items-center justify-center">
                <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Uploading file…</p>
              <p className="text-xs text-muted-foreground mt-1">Please wait</p>
            </div>
          </div>
        )}

        {/* Processing */}
        {uploadState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-purple-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">AI is generating your outline…</p>
              <p className="text-xs text-muted-foreground mt-1">
                This usually takes 30–90 seconds. Checked {pollingCount} time{pollingCount !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
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
