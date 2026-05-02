'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, Edit, Video, BookOpen, Code2, FileQuestion, Presentation, CheckCircle2, UploadCloud, FileText, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { lessonService, chapterService, courseService } from '@/lib/course-service'
import { exerciseService } from '@/lib/exercise-service'
import {
  LessonDto, ChapterDto, CourseDto, UpdateLessonRequest, LessonType, LessonDetailDto,
  ExerciseDto, ExerciseDetailDto, QuizQuestionDto, QuizAnswerDto
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'
import { VideoUploadSection } from './video-upload'
import { AiMaterialSection } from './ai-material-section'

// ─── Lesson Type Icon & Color ─────────────────────────────────────────────────

const TYPE_META: Record<LessonType, { icon: React.ReactNode; label: string; color: string }> = {
  [LessonType.Video]: { icon: <Video className="h-4 w-4" />, label: 'Video', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  [LessonType.Reading]: { icon: <BookOpen className="h-4 w-4" />, label: 'Reading', color: 'bg-green-100 text-green-700 border-green-200' },
  [LessonType.Coding]: { icon: <Code2 className="h-4 w-4" />, label: 'Coding', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  [LessonType.Quiz]: { icon: <FileQuestion className="h-4 w-4" />, label: 'Quiz', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  [LessonType.Slide]: { icon: <Presentation className="h-4 w-4" />, label: 'Slide', color: 'bg-pink-100 text-pink-700 border-pink-200' },
}

// ─── Reading Content Section ──────────────────────────────────────────────────

function ReadingContentSection({ lessonId, initialContent }: { lessonId: string; initialContent?: string }) {
  const [content, setContent] = useState(initialContent ?? '')
  const [isEditing, setIsEditing] = useState(!initialContent)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await lessonService.upsertReading(lessonId, { content })
      toast.success('Reading content saved.')
      setIsEditing(false)
    } catch {
      toast.error('Failed to save reading content.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" /> Reading Content
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => { setContent(initialContent ?? ''); setIsEditing(false) }} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Edit Content
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <>
          <Textarea
            className="min-h-[400px] font-mono text-sm"
            placeholder="Write your reading content in Markdown..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Supports Markdown formatting.</p>
        </>
      ) : (
        <div className="min-h-[200px] rounded-lg bg-muted/20 p-6 prose prose-sm dark:prose-invert max-w-none border border-dashed">
          {content || <span className="text-muted-foreground italic">No content yet. Click edit to add reading material.</span>}
        </div>
      )}
    </div>
  )
}

// ─── Coding Content Section ───────────────────────────────────────────────────

function CodingContentSection({ lessonId, initialExerciseId, initialExerciseTitle }: {
  lessonId: string
  initialExerciseId?: string
  initialExerciseTitle?: string
}) {
  const [search, setSearch] = useState('')
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [selectedId, setSelectedId] = useState(initialExerciseId ?? '')
  const [selectedTitle, setSelectedTitle] = useState(initialExerciseTitle ?? '')
  const [exerciseDetail, setExerciseDetail] = useState<ExerciseDetailDto | null>(null)
  const [isEditing, setIsEditing] = useState(!initialExerciseId)
  const [searching, setSearching] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    setSearching(true)
    try {
      const res = await lessonService.searchExercises(q)
      setExercises(res?.items ?? [])
    } catch {
      setExercises([])
    } finally {
      setSearching(false)
    }
  }, [])

  const fetchDetail = useCallback(async (eid: string) => {
    setLoadingDetail(true)
    try {
      const res = await exerciseService.getById(eid)
      setExerciseDetail(res)
    } catch {
      setExerciseDetail(null)
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    doSearch('')
    if (initialExerciseId) {
      fetchDetail(initialExerciseId)
    }
  }, [doSearch, fetchDetail, initialExerciseId])

  // Search debounce - 3 seconds
  useEffect(() => {
    if (search === '') {
      doSearch('')
      return
    }
    const t = setTimeout(() => doSearch(search), 3000)
    return () => clearTimeout(t)
  }, [search, doSearch])

  async function handleSave() {
    if (!selectedId) { toast.error('Please select an exercise.'); return }
    setSaving(true)
    try {
      await lessonService.upsertCoding(lessonId, { exerciseId: selectedId })
      toast.success('Exercise linked successfully.')
      setIsEditing(false)
    } catch {
      toast.error('Failed to link exercise.')
    } finally {
      setSaving(false)
    }
  }

  const handleSelect = (ex: ExerciseDto) => {
    setSelectedId(ex.id)
    setSelectedTitle(ex.title)
    setSearch('')
    setShowResults(false)
    fetchDetail(ex.id)
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Code2 className="h-5 w-5 text-orange-600" /> Coding Exercise
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => {
                setSelectedId(initialExerciseId ?? '');
                setSelectedTitle(initialExerciseTitle ?? '');
                if (initialExerciseId) fetchDetail(initialExerciseId);
                setIsEditing(false)
              }} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !selectedId} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Change Exercise
            </Button>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-2' : ''} gap-6`}>
        {/* Left: Search and Selection (Only in Edit mode) */}
        {isEditing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search & Select Exercise</Label>
              <div className="relative">
                <Input
                  placeholder="Type to search exercises..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowResults(true) }}
                  onFocus={() => setShowResults(true)}
                />
                {searching && (
                  <div className="absolute right-3 top-2.5 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground animate-pulse">Searching...</span>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {showResults && (
                <div className="rounded-lg border bg-popover shadow-md overflow-hidden max-h-72 flex flex-col z-10 relative">
                  <div className="p-2 border-b bg-muted/30 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {search ? `Search results for "${search}"` : 'Available exercises'}
                  </div>
                  <div className="overflow-y-auto">
                    {exercises.length > 0 ? (
                      exercises.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => handleSelect(ex)}
                          className={`w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors flex items-start gap-3 border-b last:border-0 ${selectedId === ex.id ? 'bg-primary/5' : ''}`}
                        >
                          <div className={`mt-0.5 p-1.5 rounded-md ${selectedId === ex.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <Code2 className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{ex.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">{ex.difficulty}</Badge>
                              <span className="text-[10px] text-muted-foreground">{ex.category}</span>
                            </div>
                          </div>
                          {selectedId === ex.id && <CheckCircle2 className="h-4 w-4 text-primary mt-1" />}
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        {searching ? 'Loading exercises...' : 'No exercises found.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedId && (
              <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Selected exercise</p>
                  <p className="text-sm font-medium truncate">{selectedTitle || selectedId}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right/Full: Preview Detail */}
        <div className="space-y-4">
          <Label>{isEditing ? 'Exercise Preview' : 'Linked Exercise Details'}</Label>
          {loadingDetail ? (
            <div className="h-[300px] rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Loading detail...</span>
            </div>
          ) : exerciseDetail ? (
            <div className={`rounded-lg border bg-muted/20 overflow-hidden flex flex-col ${isEditing ? 'h-[400px]' : 'min-h-[300px]'}`}>
              <div className="px-4 py-3 border-b bg-card">
                <h3 className="font-medium">{exerciseDetail.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] capitalize">{exerciseDetail.difficulty}</Badge>
                  <span className="text-[10px] text-muted-foreground">{exerciseDetail.category}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{exerciseDetail.testCases?.length || 0} Test Cases</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</p>
                  <div className="text-xs prose prose-sm dark:prose-invert max-w-none">
                    {exerciseDetail.description}
                  </div>
                </div>

                {exerciseDetail.defaultCodes && exerciseDetail.defaultCodes.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Starter Code ({exerciseDetail.defaultCodes[0].language})</p>
                    <pre className="p-3 rounded-md bg-zinc-950 text-zinc-100 text-[10px] font-mono overflow-x-auto">
                      {exerciseDetail.defaultCodes[0].starterCode}
                    </pre>
                  </div>
                )}
              </div>
              <div className="p-3 border-t bg-card text-center">
                <Link
                  href={`/management/exercises/${exerciseDetail.id}`}
                  target="_blank"
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  Manage Full Exercise Details
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-[300px] rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground text-center px-8">
              <Code2 className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">
                {isEditing ? 'Select an exercise from the left to see a preview.' : 'No exercise linked yet. Click "Change Exercise" to link one.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Quiz Content Section ─────────────────────────────────────────────────────

function QuizContentSection({ lessonId, initialDescription, initialPassingScore, initialQuestions }: {
  lessonId: string
  initialDescription?: string
  initialPassingScore?: number
  initialQuestions?: QuizQuestionDto[]
}) {
  const [description, setDescription] = useState(initialDescription ?? '')
  const [passingScore, setPassingScore] = useState(initialPassingScore ?? 70)
  const [questions, setQuestions] = useState<QuizQuestionDto[]>(initialQuestions ?? [])
  const [isEditing, setIsEditing] = useState(!initialDescription)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (questions.length === 0) { toast.error('Please add at least one question.'); return }
    for (const q of questions) {
      if (!q.text.trim()) { toast.error('Question text cannot be empty.'); return }
      if (q.answers.length < 2) { toast.error(`Question "${q.text}" needs at least 2 answers.`); return }
      if (!q.answers.some(a => a.isCorrect)) { toast.error(`Question "${q.text}" needs at least one correct answer.`); return }
    }

    setSaving(true)
    try {
      await lessonService.upsertQuiz(lessonId, { description, passingScore, questions })
      toast.success('Quiz saved successfully.')
      setIsEditing(false)
    } catch {
      toast.error('Failed to save quiz.')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = () => {
    const newQ: QuizQuestionDto = {
      text: '',
      position: questions.length,
      answers: [
        { text: '', isCorrect: true, position: 0 },
        { text: '', isCorrect: false, position: 1 },
      ]
    }
    setQuestions([...questions, newQ])
  }

  const updateQuestion = (idx: number, updates: Partial<QuizQuestionDto>) => {
    const next = [...questions]
    next[idx] = { ...next[idx], ...updates }
    setQuestions(next)
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, position: i })))
  }

  const addAnswer = (qIdx: number) => {
    const q = questions[qIdx]
    const nextAnswers = [...q.answers, { text: '', isCorrect: false, position: q.answers.length }]
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  const updateAnswer = (qIdx: number, aIdx: number, updates: Partial<QuizAnswerDto>) => {
    const q = questions[qIdx]
    const nextAnswers = [...q.answers]
    // If setting IsCorrect to true, set others to false (assuming single choice for now, or remove this if multiple)
    if (updates.isCorrect) {
      nextAnswers.forEach((a, i) => { a.isCorrect = i === aIdx })
    } else {
      nextAnswers[aIdx] = { ...nextAnswers[aIdx], ...updates }
    }
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const q = questions[qIdx]
    if (q.answers.length <= 2) { toast.error('Minimum 2 answers required.'); return }
    const nextAnswers = q.answers.filter((_, i) => i !== aIdx).map((a, i) => ({ ...a, position: i }))
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-purple-600" /> Quiz Management
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => {
                setDescription(initialDescription ?? '');
                setPassingScore(initialPassingScore ?? 70);
                setQuestions(initialQuestions ?? []);
                setIsEditing(false)
              }} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving...' : 'Save Quiz'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Edit Quiz
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-8">
          {/* Settings Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-muted/20 border border-dashed">
            <div className="md:col-span-2 space-y-1.5">
              <Label>Quiz Description</Label>
              <Textarea
                placeholder="Intro for students..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="relative group rounded-xl border bg-card overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question {qIdx + 1}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeQuestion(qIdx)}>
                    Remove
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Question Text</Label>
                    <Input
                      placeholder="e.g. What is the capital of France?"
                      value={q.text}
                      onChange={e => updateQuestion(qIdx, { text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs">Answers (Mark the correct one)</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {q.answers.map((a, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => updateAnswer(qIdx, aIdx, { isCorrect: true })}
                            className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${a.isCorrect ? 'bg-green-600 border-green-600 text-white' : 'hover:border-green-600'}`}
                          >
                            {a.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <Input
                            className="h-9 text-sm"
                            placeholder={`Answer ${aIdx + 1}`}
                            value={a.text}
                            onChange={e => updateAnswer(qIdx, aIdx, { text: e.target.value })}
                          />
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeAnswer(qIdx, aIdx)}>
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" onClick={() => addAnswer(qIdx)}>
                      + Add Answer Option
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full border-dashed py-8 h-auto flex-col gap-2 hover:bg-primary/5 hover:border-primary/50" onClick={addQuestion}>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <FileQuestion className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Add New Question</p>
                <p className="text-xs text-muted-foreground">Click to add a multiple choice question to this quiz</p>
              </div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-6 p-5 rounded-xl bg-muted/20 border border-dashed">
            <div className="flex-1 min-w-[200px] space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quiz Description</p>
              <p className="text-sm">{description || 'No description provided.'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Passing Score</p>
              <Badge variant="secondary" className="text-sm px-3">{passingScore}%</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Questions</p>
              <p className="text-sm font-semibold">{questions.length} items</p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card/50">
                <p className="text-sm font-medium mb-3 flex items-start gap-2">
                  <span className="text-primary">Q{i + 1}.</span> {q.text}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
                  {q.answers.map((a, j) => (
                    <div key={j} className={`text-xs p-2 rounded border flex items-center justify-between ${a.isCorrect ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900' : 'bg-muted/30 text-muted-foreground'}`}>
                      <span>{a.text}</span>
                      {a.isCorrect && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                <p className="text-sm italic">No questions added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Slide Content Section ────────────────────────────────────────────────────

function SlideContentSection({ lessonId, initialFileUrl }: { lessonId: string; initialFileUrl?: string }) {
  const [activeTab, setActiveTab] = useState<'ai' | 'upload'>(initialFileUrl ? 'upload' : 'ai')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Presentation className="h-6 w-6 text-pink-600" /> 
          Slide Management
        </h2>
        <div className="flex bg-muted/50 p-1 rounded-lg border">
          <Button 
            variant={activeTab === 'ai' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            Hỗ trợ soạn thảo
          </Button>
          <Button 
            variant={activeTab === 'upload' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('upload')}
          >
            <UploadCloud className="h-4 w-4 text-blue-600" />
            Direct Upload
          </Button>
        </div>
      </div>

      {activeTab === 'ai' ? (
        <AiMaterialSection lessonId={lessonId} />
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Upload Existing Slide
            </h3>
          </div>
          
          <div className="space-y-6">
            {initialFileUrl ? (
              <div className="max-w-2xl bg-muted/20 rounded-lg p-5 border border-dashed space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Slide Resource</p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-pink-500/10 rounded flex items-center justify-center shrink-0 border border-pink-200">
                    <Presentation className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{initialFileUrl}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={initialFileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium">
                        View Document
                      </a>
                      <span className="text-muted-foreground text-[10px]">Public Link</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-sm text-center">Select your slide file</h3>
              <p className="text-xs text-muted-foreground mb-6 text-center max-w-xs">Upload a PDF, PPTX, or DOCX directly. Students will see this as the primary lesson content.</p>
              <Input 
                type="file" 
                className="max-w-sm" 
                accept=".pdf,.pptx,.ppt,.docx,.doc" 
              />
              <Button className="mt-4 gap-2">
                <UploadCloud className="h-4 w-4" /> Upload Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<LessonDto | null>(null)
  const [detail, setDetail] = useState<LessonDetailDto | null>(null)
  const [chapter, setChapter] = useState<ChapterDto | null>(null)
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [form, setForm] = useState<UpdateLessonRequest>({
    chapterId: '',
    courseId: '',
    title: '',
    lessonType: LessonType.Video,
    position: 0
  })

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true)
      try {
        const [l, d] = await Promise.all([
          lessonService.getById(id),
          lessonService.getDetail(id)
        ])
        setLesson(l)
        setDetail(d)
        setForm({
          chapterId: l?.chapterId || '',
          courseId: l?.courseId || '',
          title: l?.title || '',
          lessonType: l?.lessonType || LessonType.Video,
          position: l?.position || 0
        })
        if (l?.chapterId) {
          try {
            const ch = await chapterService.getById(l.chapterId)
            setChapter(ch)
            if (ch?.courseId) {
              const c = await courseService.getById(ch.courseId)
              setCourse(c)
            }
          } catch (e) {
            console.error(e)
          }
        }
      } catch {
        toast.error('Lesson not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [id])

  async function handleSave() {
    setSaving(true)
    try {
      await lessonService.update(id, form)
      toast.success('Lesson updated successfully.')
      const [updated, updatedDetail] = await Promise.all([
        lessonService.getById(id),
        lessonService.getDetail(id)
      ])
      setLesson(updated)
      setDetail(updatedDetail)
    } catch {
      toast.error('Failed to update lesson.')
    } finally {
      setSaving(false)
      setEditDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="text-center py-16 text-muted-foreground">Lesson not found.</div>
  }

  const numericMap: Record<number, LessonType> = {
    1: LessonType.Video,
    2: LessonType.Reading,
    3: LessonType.Coding,
    4: LessonType.Quiz,
    5: LessonType.Slide
  }
  const typeMeta = TYPE_META[lesson.lessonType] || 
    TYPE_META[numericMap[lesson.lessonType as unknown as number]] ||
    TYPE_META[LessonType.Video]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push(`/management/chapters/${lesson.chapterId}`)}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/management/courses/${lesson.courseId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {course ? course.title : lesson.courseName || 'Course'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link
              href={`/management/chapters/${lesson.chapterId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {chapter ? chapter.title : lesson.chapterName || 'Chapter'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-muted-foreground">Lesson {lesson.position}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-2xl font-semibold truncate">{lesson.title}</h1>
              <Badge className={`gap-1.5 shrink-0 border ${typeMeta.color}`}>
                {typeMeta.icon} {typeMeta.label}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-2 shrink-0">
              <Edit className="h-4 w-4" /> Edit Info
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lesson Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.lessonType}
                onValueChange={v => setForm(prev => ({ ...prev, lessonType: v as LessonType }))}
              >
                <SelectTrigger>
                  <SelectValue>{form.lessonType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LessonType).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Type-specific Content Section */}
      {lesson.lessonType === LessonType.Video && (
        <VideoUploadSection lessonId={id} initialVideoUrl={detail?.videoUrl} />
      )}

      {lesson.lessonType === LessonType.Reading && (
        <ReadingContentSection lessonId={id} initialContent={detail?.readingContent} />
      )}

      {lesson.lessonType === LessonType.Coding && (
        <CodingContentSection
          lessonId={id}
          initialExerciseId={detail?.exerciseId}
          initialExerciseTitle={detail?.exerciseTitle}
        />
      )}

      {lesson.lessonType === LessonType.Quiz && (
        <QuizContentSection
          lessonId={id}
          initialDescription={detail?.quizDescription}
          initialPassingScore={detail?.quizPassingScore}
          initialQuestions={detail?.quizQuestions}
        />
      )}

      {lesson.lessonType === LessonType.Slide && (
        <SlideContentSection lessonId={id} initialFileUrl={detail?.slideFileUrl} />
      )}
    </div>
  )
}
