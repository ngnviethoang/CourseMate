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

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

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

  const handleAddToCart = async () => {
    if (!course) return
    setAddingToCart(true)
    try {
      await studentService.addToCart(course.id)
      toast.success('Added to cart successfully!')
    } catch {
      // Error handled by api-client automatically
    } finally {
      setAddingToCart(false)
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
          <p className="text-lg text-muted-foreground leading-relaxed">{course.description}</p>

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
                <div className="text-3xl font-bold text-primary">${course.price.toFixed(2)}</div>
                <Button
                  size="lg"
                  className="w-full md:w-auto h-12 px-8 gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
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
