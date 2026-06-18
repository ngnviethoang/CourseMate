'use client'

import { orderService } from '@/lib/order-service'
import { courseService } from '@/lib/course-service'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  PlayCircle,
  ShoppingCart,
  Sparkles,
  Users,
  Star
} from 'lucide-react'
import { LessonType, StudentCourseDetailDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { CourseReviews } from './course-reviews'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
      return <PlayCircle className="h-5 w-5 text-primary" />
    case LessonType.Reading:
      return <FileText className="h-5 w-5 text-muted-foreground" />
    case LessonType.Coding:
      return <Sparkles className="h-5 w-5 text-primary" />
    case LessonType.Quiz:
      return <CheckCircle2 className="h-5 w-5 text-primary" />
    case LessonType.Slide:
      return <Layers3 className="h-5 w-5 text-primary" />
    default:
      return <BookOpen className="h-5 w-5 text-primary" />
  }
}

function CourseDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 animate-pulse">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_390px]">
        <div className="space-y-5">
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="space-y-2.5">
            <div className="h-10 w-3/4 rounded-lg bg-muted" />
            <div className="h-4 w-full rounded-full bg-muted" />
          </div>
          <div className="grid gap-2.5 grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 rounded-xl bg-muted" />
            ))}
          </div>
          <div className="h-48 rounded-xl bg-muted" />
        </div>
        <div className="h-[480px] rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [isInCart, setIsInCart] = useState(false)

  const fetchCourse = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await courseService.getById(id as string)
      setCourse(res as unknown as StudentCourseDetailDto)
      setIsInCart(Boolean((res as unknown as { isInCart?: boolean })?.isInCart))
    } catch {
      toast.error('Không thể tải chi tiết khóa học.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
      // Error handled by api-client
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
      // Error handled by api-client
    } finally {
      setSubmitting(false)
    }
  }

  const totalLessons = course?.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0) ?? 0
  const completedLessons =
    course?.chapters.reduce((acc, chapter) => acc + chapter.lessons.filter(l => l.isCompleted).length, 0) ?? 0
  const stats = course
    ? [
        { label: 'Danh mục', value: course.categoryName || 'Đang cập nhật', icon: BookOpen },
        { label: 'Chương học', value: `${course.chapters.length} chương`, icon: Layers3 },
        { label: 'Bài học', value: `${totalLessons} bài học`, icon: PlayCircle },
        { label: 'Giảng viên', value: course.instructorName || 'Không rõ', icon: Users }
      ]
    : []

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-6xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Về danh sách khóa học
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              {course?.categoryName && (
                <Badge variant="secondary" className="text-[10px] font-semibold shrink-0">
                  {course.categoryName}
                </Badge>
              )}
              <h1 className="text-2xl font-bold tracking-tight">
                {loading ? 'Đang tải...' : course ? course.title : 'Chi tiết khóa học'}
              </h1>
            </div>
            {course && (
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <p>
                  Giảng viên: <span className="font-medium text-foreground">{course.instructorName || 'CourseMate'}</span>
                </p>
                {course.totalReviews !== undefined && course.totalReviews > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{course.averageRating}</span>
                    <span>({course.totalReviews} đánh giá)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <CourseDetailSkeleton />
      ) : !course ? (
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <BookOpen className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-2">Không tìm thấy khóa học</p>
          <p className="text-sm text-muted-foreground mb-6">Khóa học này không tồn tại hoặc đã bị xóa.</p>
          <Button asChild variant="outline">
            <Link href="/">Quay lại danh sách</Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-8">
          {/* Hero: info + purchase card */}
          <section className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_390px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="space-y-2.5">
                  <p className="max-w-3xl text-[15px] leading-6 text-muted-foreground">
                    Học cùng {course.instructorName || 'giảng viên của CourseMate'} qua lộ trình rõ ràng, nội dung có
                    cấu trúc và dễ theo dõi.
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5 grid-cols-2">
                {stats.map(({ label, value, icon: Icon }) => (
                  <Card
                    key={label}
                    className="border-border bg-background shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
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

            {/* Purchase sidebar */}
            <div className="sticky top-24">
              <Card className="overflow-hidden border-border bg-background shadow-lg">
                <div className="relative aspect-video bg-muted/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.imageUrl || 'https://placehold.co/800x450?text=KhoaHoc'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] text-muted-foreground">Học phí</p>
                      <div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(course.price)}</div>
                    </div>
                    {course.isEnrolled && (
                      <Badge className="border-0 bg-primary/10 text-[11px] text-primary hover:bg-primary/20">
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
                          className="h-full rounded-full bg-primary transition-all duration-700"
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
                    <Button
                      size="lg"
                      className="h-10 w-full gap-2 text-sm"
                      onClick={() => router.push(`/learning/${course.id}`)}
                    >
                      <PlayCircle className="h-4 w-4" />
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

          {/* Content Tabs: Curriculum & Reviews */}
          <Tabs defaultValue="curriculum" className="w-full pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '150ms' }}>
            <TabsList className="bg-muted/50 p-1 rounded-xl h-11 mb-6">
              <TabsTrigger
                value="curriculum"
                className="rounded-lg px-6 py-1.5 text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Nội dung khóa học
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg px-6 py-1.5 text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Đánh giá {course.totalReviews ? `(${course.totalReviews})` : ''}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="mt-0 outline-none">
              <section className="space-y-4">
                <div className="flex flex-row items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Nội dung khóa học</h2>
                    <p className="text-[13px] text-muted-foreground">
                      Theo dõi từng chương và bài học theo thứ tự để học dễ hơn.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
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
                    {course.chapters.map((chapter, chIdx) => (
                      <div
                        key={chapter.id}
                        className="animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards duration-300"
                        style={{ animationDelay: `${Math.min(chIdx * 60, 360)}ms` }}
                      >
                        <AccordionItem
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
                              <Badge
                                variant="secondary"
                                className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                              >
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
                                    className="flex flex-row items-center justify-between gap-2.5 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent/40"
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
                                    <div className="flex items-center gap-2 shrink-0">
                                      <Badge
                                        variant="outline"
                                        className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                                      >
                                        {lessonTypeLabel[lesson.lessonType]}
                                      </Badge>
                                      {course.isEnrolled && lesson.isCompleted && (
                                        <Badge className="rounded-full px-2 py-0.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">
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
                      </div>
                    ))}
                  </Accordion>
                )}
              </section>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 outline-none">
              <section className="space-y-4">
                <CourseReviews courseId={course.id} isEnrolled={course.isEnrolled} onReviewSubmitted={fetchCourse} />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
