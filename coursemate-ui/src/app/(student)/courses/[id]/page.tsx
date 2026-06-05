'use client'

import { orderService } from '@/lib/order-service'
import { courseService } from '@/lib/course-service'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  PlayCircle,
  ShoppingCart,
  Sparkles,
  Users
} from 'lucide-react'
import { LessonType, StudentCourseDetailDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const lessonTypeLabel: Record<LessonType, string> = {
  [LessonType.Video]: 'Video',
  [LessonType.Reading]: 'Bài đọc',
  [LessonType.Coding]: 'Bài code',
  [LessonType.Quiz]: 'Quiz',
  [LessonType.Slide]: 'Slide'
}

const getLessonIcon = (lessonType: LessonType) => {
  switch (lessonType) {
    case LessonType.Video:
      return <PlayCircle className="h-5 w-5 text-blue-500" />
    case LessonType.Reading:
      return <FileText className="h-5 w-5 text-amber-500" />
    case LessonType.Coding:
      return <Sparkles className="h-5 w-5 text-violet-500" />
    case LessonType.Quiz:
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    case LessonType.Slide:
      return <Layers3 className="h-5 w-5 text-sky-500" />
    default:
      return <BookOpen className="h-5 w-5 text-primary" />
  }
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchCourse = async () => {
      setLoading(true)
      try {
        const res = await courseService.getById(id)
        setCourse(res as unknown as StudentCourseDetailDto)
        setIsInCart(Boolean((res as unknown as { isInCart?: boolean })?.isInCart))
      } catch {
        toast.error('Không thể tải chi tiết khóa học.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const handleAddToCart = async () => {
    if (!course) return

    setSubmitting(true)
    try {
      await orderService.addToCart(course.id)
      setIsInCart(true)
      toast.success('Đã thêm vào giỏ hàng thành công!')
    } catch {
      // Error handled by api-client automatically
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnrollFree = async () => {
    if (!course) return

    setSubmitting(true)
    try {
      await orderService.enrollFree(course.id)
      toast.success('Đăng ký khóa học thành công!')
      router.push(`/learning/${course.id}`)
    } catch {
      // Error handled by api-client automatically
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary shadow-md" />
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-20 text-muted-foreground">Không tìm thấy khóa học.</div>
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)
  const completedLessons = course.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.filter(lesson => lesson.isCompleted).length,
    0
  )
  const stats = [
    { label: 'Danh mục', value: course.categoryName || 'Đang cập nhật', icon: BookOpen },
    { label: 'Chương học', value: `${course.chapters.length} chương`, icon: Layers3 },
    { label: 'Bài học', value: `${totalLessons} bài học`, icon: PlayCircle },
    { label: 'Giảng viên', value: course.instructorName || 'Không rõ giảng viên', icon: Users }
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <section className="grid gap-6 grid-cols-[minmax(0,1.2fr)_390px]">
        <div className="space-y-5">
          <div className="space-y-3">
            <Badge className="w-fit border-0 bg-primary/10 text-primary hover:bg-primary/20">
              {course.categoryName}
            </Badge>
            <div className="space-y-2.5">
              <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
              <p className="max-w-3xl text-[15px] leading-6 text-muted-foreground">
                Học cùng {course.instructorName || 'giảng viên của CourseMate'} qua lộ trình rõ ràng, nội dung có cấu
                trúc và dễ theo dõi.
              </p>
            </div>
          </div>

          <div className="grid gap-2.5 grid-cols-2">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-border bg-background shadow-sm">
                <CardContent className="flex items-start gap-2 p-2.5">
                  <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-[13px] font-semibold leading-5 text-foreground">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {course.description && (
            <Card className="border-border bg-background shadow-sm">
              <CardContent className="space-y-3 p-5">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Mô tả khóa học</h2>
                  <p className="text-[13px] text-muted-foreground">
                    Thông tin tổng quan và mục tiêu học tập của khóa học.
                  </p>
                </div>
                <div className="relative">
                  <div
                    className={`prose prose-sm max-w-none dark:prose-invert prose-p:leading-6 prose-img:rounded-xl prose-img:mx-auto transition-all duration-300 ${!showFullDesc ? 'max-h-56 overflow-hidden' : ''}`}
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                  {!showFullDesc && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="h-9 w-auto px-4 text-xs"
                >
                  {showFullDesc ? 'Thu gọn mô tả' : 'Xem thêm mô tả'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="sticky top-24">
          <Card className="overflow-hidden border-border bg-background shadow-lg">
            <div className="relative aspect-video bg-muted/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.imageUrl || 'https://placehold.co/800x450?text=KhoaHoc'}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] text-muted-foreground">Học phí</p>
                  <div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(course.price)}</div>
                </div>
                {course.isEnrolled && (
                  <Badge className="border-0 bg-emerald-500/10 text-[11px] text-emerald-600 hover:bg-emerald-500/20">
                    Đã đăng ký
                  </Badge>
                )}
              </div>

              {course.isEnrolled ? (
                <div className="rounded-xl border border-primary/15 bg-primary/10 p-3.5">
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-medium">Tiến độ học</p>
                      <p className="text-[11px] text-muted-foreground">
                        Hoàn thành {completedLessons}/{totalLessons} bài học
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-primary">{course.progressPercentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-[13px] text-muted-foreground">
                  Truy cập toàn bộ nội dung khóa học sau khi đăng ký. Bạn có thể học ngay sau khi hoàn tất.
                </div>
              )}

              {course.isEnrolled ? (
                <Button size="lg" className="h-10 w-full text-sm" onClick={() => router.push(`/learning/${course.id}`)}>
                  Tiếp tục học
                </Button>
              ) : course.price === 0 ? (
                <Button size="lg" className="h-10 w-full text-sm" onClick={handleEnrollFree} disabled={submitting}>
                  {submitting ? 'Đang đăng ký...' : 'Đăng ký học miễn phí'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="h-10 w-full gap-2 text-sm"
                  onClick={isInCart ? () => router.push('/cart') : handleAddToCart}
                  disabled={submitting}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {submitting ? 'Đang thêm...' : isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
                </Button>
              )}

              <div className="grid gap-2.5 rounded-xl border border-border bg-muted/10 p-3.5 grid-cols-2">
                <div className="flex items-center gap-2.5">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Lộ trình</p>
                    <p className="text-[13px] font-medium">Học theo từng chương</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Trạng thái</p>
                    <p className="text-[13px] font-medium">
                      {course.isEnrolled ? 'Có thể học ngay' : 'Sẵn sàng đăng ký'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1.5 flex-row items-end justify-between">
          <div>
            <h2 className="text-xl font-bold">Nội dung khóa học</h2>
            <p className="text-[13px] text-muted-foreground">
              Theo dõi từng chương và bài học theo thứ tự để học dễ hơn.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px]">
              {course.chapters.length} chương
            </Badge>
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px]">
              {totalLessons} bài học
            </Badge>
          </div>
        </div>

        {course.chapters.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">Chưa có chương nào.</CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {course.chapters.map(chapter => (
              <AccordionItem
                key={chapter.id}
                value={chapter.id}
                className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3.5 hover:no-underline">
                  <div className="flex w-full items-center justify-between gap-4 pr-4 text-left">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Chương {chapter.sortOrder}
                      </p>
                      <span className="text-base font-semibold">{chapter.title}</span>
                    </div>
                    <Badge variant="secondary" className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                      {chapter.lessons.length} bài học
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border bg-muted/10 px-4 pb-4 pt-3.5">
                  <div className="space-y-2.5">
                    {chapter.lessons.length === 0 ? (
                      <p className="pl-3 text-[13px] text-muted-foreground">Chưa có bài học trong chương này.</p>
                    ) : (
                      chapter.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="flex flex-col gap-2.5 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent/40 flex-row items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="rounded-lg border border-border bg-muted/40 p-1.5">
                              {getLessonIcon(lesson.lessonType)}
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold">
                                {chapter.sortOrder}.{lesson.sortOrder} - {lesson.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Bài học trong chương {chapter.sortOrder}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start self-center">
                            <Badge
                              variant="outline"
                              className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                            >
                              {lessonTypeLabel[lesson.lessonType]}
                            </Badge>
                            {course.isEnrolled && lesson.isCompleted && (
                              <Badge
                                variant="default"
                                className="rounded-full px-2 py-0.5 bg-emerald-500 text-[10px] uppercase tracking-wider text-white"
                              >
                                Hoàn thành
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
      </section>
    </div>
  )
}
