'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PlayCircle, FileText, CheckCircle2, Users, BookOpen, ShoppingCart } from 'lucide-react'
import { studentService } from '@/lib/student-service'
import { StudentCourseDetailDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    studentService
      .getCourseById(id)
      .then(res => {
        setCourse(res || null)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load course details.')
        setLoading(false)
      })
  }, [id])

  const ensureAuthenticated = () => {
    const hasToken = document.cookie.includes('accessToken=')
    if (!hasToken) {
      router.push('/login')
      return false
    }

    return true
  }

  const handleAddToCart = async () => {
    if (!course) return

    if (!ensureAuthenticated()) return

    setSubmitting(true)
    try {
      await studentService.addToCart(course.id)
      toast.success('Added to cart successfully!')
    } catch {
      // Error handled by api-client automatically
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnrollFree = async () => {
    if (!course) return

    if (!ensureAuthenticated()) return

    setSubmitting(true)
    try {
      await studentService.enrollFree(course.id)
      toast.success('Enrolled successfully!')
      router.push(`/learning/${course.id}`)
    } catch {
      // Error handled by api-client automatically
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-20 text-muted-foreground">Course not found.</div>
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{course.categoryName}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{course.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{course.chapters.length} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>By {course.instructorName || 'Unknown Instructor'}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            {course.isEnrolled ? (
              <Button
                size="lg"
                className="w-full md:w-auto h-12 px-8"
                onClick={() => router.push(`/learning/${course.id}`)}
              >
                Continue Learning
              </Button>
            ) : (
              <>
                <div className="text-3xl font-bold text-primary">{formatCurrency(course.price)}</div>
                <div className="flex w-full md:w-auto">
                  {course.price === 0 ? (
                    <Button
                      size="lg"
                      className="h-12 px-8 gap-2 flex-1 sm:flex-initial"
                      onClick={handleEnrollFree}
                      disabled={submitting}
                    >
                      {submitting ? 'Enrolling...' : 'Enroll'}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="h-12 px-8 gap-2 flex-1 sm:flex-initial"
                      onClick={handleAddToCart}
                      disabled={submitting}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {submitting ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.imageUrl || 'https://placehold.co/800x450?text=Course+Image'}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Course Description */}
      {course.description && (
        <div className="space-y-6 pt-8 border-t">
          <h2 className="text-2xl font-bold">About this course</h2>
          <div className="relative flex flex-col rounded-xl bg-card border p-6 md:p-8 shadow-sm">
            <div
              className={`prose prose-sm md:prose-base max-w-none dark:prose-invert prose-img:rounded-lg prose-img:mx-auto transition-all duration-300 ${!showFullDesc ? 'max-h-64 overflow-hidden' : ''}`}
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
            {!showFullDesc && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent pointer-events-none rounded-b-xl" />
            )}
            <Button
              variant="outline"
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="mt-6 self-center w-full max-w-xs font-medium"
            >
              {showFullDesc ? 'Show less' : 'Show more description'}
            </Button>
          </div>
        </div>
      )}

      {/* Syllabus Section */}
      <div className="space-y-6 pt-8 border-t">
        <h2 className="text-2xl font-bold">Course Syllabus</h2>

        {course.chapters.length === 0 ? (
          <p className="text-muted-foreground">No chapters available yet.</p>
        ) : (
          <Accordion className="w-full">
            {course.chapters.map(chapter => (
              <AccordionItem key={chapter.id} value={chapter.id} className="border px-4 py-1 mb-4 rounded-lg bg-card">
                <AccordionTrigger className="hover:no-underline font-semibold text-lg">
                  <div className="flex justify-between items-center w-full pr-4">
                    <span>
                      {chapter.position}. {chapter.title}
                    </span>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {chapter.lessons.length} lessons
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <div className="space-y-2">
                    {chapter.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground pl-4">No lessons in this chapter.</p>
                    ) : (
                      chapter.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors gap-2"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.lessonType === 'Video' ? (
                              <PlayCircle className="h-5 w-5 text-blue-500" />
                            ) : lesson.lessonType === 'Reading' ? (
                              <FileText className="h-5 w-5 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            )}
                            <span className="font-medium text-sm">
                              {chapter.position}.{lesson.position} - {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                              {lesson.lessonType}
                            </Badge>
                            {course.isEnrolled && lesson.isCompleted && (
                              <Badge
                                variant="default"
                                className="bg-emerald-500 text-[10px] uppercase tracking-wider text-white"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
