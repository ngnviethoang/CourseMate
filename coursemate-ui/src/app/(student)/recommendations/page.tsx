'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  ShoppingCart,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  CheckCircle2,
  XCircle,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { recommendationService } from '@/lib/recommendation-service'
import { orderService } from '@/lib/order-service'
import {
  RecommendationResponseDto,
  RecommendedCourseDto,
  RecommendedContestDto,
  RecommendedExerciseDto,
  RecommendationReason,
  RecommendationFeedback,
  StudentRecommendationStatsDto
} from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Reason icons and labels
const REASON_CONFIG: Record<RecommendationReason, { icon: React.ReactNode; label: string; color: string }> = {
  [RecommendationReason.ContentMatch]: { icon: <Target className="h-3 w-3" />, label: 'Phù hợp nội dung', color: 'text-blue-600 bg-blue-100' },
  [RecommendationReason.CollaborativeFilter]: { icon: <Users className="h-3 w-3" />, label: 'Bạn cùng level đã học', color: 'text-purple-600 bg-purple-100' },
  [RecommendationReason.WeaknessTargeted]: { icon: <Brain className="h-3 w-3" />, label: 'Cải thiện điểm yếu', color: 'text-orange-600 bg-orange-100' },
  [RecommendationReason.PopularChoice]: { icon: <TrendingUp className="h-3 w-3" />, label: 'Phổ biến', color: 'text-green-600 bg-green-100' },
  [RecommendationReason.SimilarStudentEnrolled]: { icon: <GraduationCap className="h-3 w-3" />, label: 'Học viên tương tự', color: 'text-indigo-600 bg-indigo-100' },
  [RecommendationReason.InstructorExpertise]: { icon: <Star className="h-3 w-3" />, label: 'Giảng viên chuyên gia', color: 'text-amber-600 bg-amber-100' },
  [RecommendationReason.CategoryInterest]: { icon: <BookOpen className="h-3 w-3" />, label: 'Theo sở thích', color: 'text-cyan-600 bg-cyan-100' },
  [RecommendationReason.DifficultyMatch]: { icon: <Zap className="h-3 w-3" />, label: 'Độ khó phù hợp', color: 'text-rose-600 bg-rose-100' }
}

function ScoreBar({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const color = percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-slate-400'

  return (
    <div className="flex items-center gap-2">
      <Progress value={percentage} className="h-2 flex-1" />
      <span className="text-xs font-medium text-muted-foreground w-10 text-right">{percentage}%</span>
    </div>
  )
}

function ReasonBadge({ reason }: { reason: RecommendationReason }) {
  const config = REASON_CONFIG[reason]
  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

interface CourseRecommendationCardProps {
  course: RecommendedCourseDto
  index: number
  onFeedback: (analyticsId: string, feedback: RecommendationFeedback) => void
}

function CourseRecommendationCard({ course, index, onFeedback }: CourseRecommendationCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'notHelpful' | null>(null)

  const handleEnroll = async () => {
    try {
      setLoading('enroll')
      if (course.price === 0) {
        await orderService.enrollFree(course.courseId)
        toast.success(`Đã tham gia khóa học "${course.title}"!`)
        onFeedback(course.analyticsId, RecommendationFeedback.Enrolled)
      } else {
        await orderService.addToCart(course.courseId)
        toast.success(`Đã thêm "${course.title}" vào giỏ hàng!`)
      }
      router.push(`/courses/${course.courseId}`)
    } catch {
      // error handled by apiClient
    } finally {
      setLoading(null)
    }
  }

  const handleFeedback = async (helpful: boolean) => {
    setFeedbackGiven(helpful ? 'helpful' : 'notHelpful')
    onFeedback(course.analyticsId, helpful ? RecommendationFeedback.Helpful : RecommendationFeedback.NotHelpful)
    toast.success(helpful ? 'Cảm ơn bạn đã phản hồi!' : 'Đã ghi nhận phản hồi của bạn')
  }

  const gradientIndex = index % 8
  const gradients = [
    'from-blue-500/80 to-blue-600',
    'from-purple-500/80 to-purple-600',
    'from-emerald-500/80 to-emerald-600',
    'from-amber-500/80 to-amber-600',
    'from-rose-500/80 to-rose-600',
    'from-cyan-500/80 to-cyan-600',
    'from-indigo-500/80 to-indigo-600',
    'from-orange-500/80 to-orange-600'
  ]

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
          {course.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${gradients[gradientIndex]}`}>
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>
          )}

          {/* Score overlay */}
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-sm font-bold">{Math.round(course.score * 100)}%</span>
            </div>
          </div>

          {/* Rank badge */}
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            #{index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Header */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {course.categoryName && (
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {course.categoryName}
                    </Badge>
                  )}
                  <ScoreBar score={course.score} />
                </div>
                <Link href={`/courses/${course.courseId}`}>
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-1">{course.instructorName}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{course.averageRating.toFixed(1)}</span>
                <span>({course.enrollmentCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{course.enrollmentCount.toLocaleString()} học viên</span>
              </div>
            </div>

            {/* Reasons */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {course.reasons.map((reason, i) => (
                <ReasonBadge key={i} reason={reason} />
              ))}
            </div>

            {/* Explanation */}
            {course.explanation && (
              <p className="text-sm text-muted-foreground mt-3 p-3 bg-muted/50 rounded-lg">
                <span className="font-medium text-foreground">Tại sao gợi ý: </span>
                {course.explanation}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="font-bold text-lg">
              {course.price === 0 ? (
                <span className="text-emerald-600">Miễn phí</span>
              ) : (
                <span className="text-primary">{formatCurrency(course.price)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Feedback buttons */}
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackGiven !== null}
                  className={`p-2 rounded-lg transition-colors ${
                    feedbackGiven === 'helpful'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  title="Hữu ích"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackGiven !== null}
                  className={`p-2 rounded-lg transition-colors ${
                    feedbackGiven === 'notHelpful'
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  title="Không hữu ích"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleEnroll}
                disabled={loading !== null}
                className={buttonVariants({ className: 'rounded-xl' })}
              >
                {loading === 'enroll' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : course.price === 0 ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Vào học ngay
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {course.price === 0 ? 'Miễn phí' : 'Thêm vào giỏ'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ContestCard({ contest }: { contest: RecommendedContestDto }) {
  const statusColors: Record<string, string> = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-emerald-100 text-emerald-700',
    Ended: 'bg-slate-100 text-slate-700'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={`mb-2 ${statusColors[contest.status] || ''}`}>
              {contest.status}
            </Badge>
            <CardTitle className="text-base">{contest.title}</CardTitle>
          </div>
          <Trophy className="h-6 w-6 text-amber-500" />
        </div>
        <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {contest.exerciseCount} bài
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {contest.participantCount}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {contest.durationInMinutes} phút
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">Score: {Math.round(contest.score * 100)}%</span>
        </div>

        <Link href={`/contests/${contest.contestId}`} className={buttonVariants({ size: 'sm', className: 'w-full' })}>
          Xem chi tiết <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

function ExerciseCard({ exercise }: { exercise: RecommendedExerciseDto }) {
  const difficultyColors: Record<string, string> = {
    Easy: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={`mb-2 ${difficultyColors[exercise.difficulty] || ''}`}>
              {exercise.difficulty}
            </Badge>
            <CardTitle className="text-base">{exercise.title}</CardTitle>
          </div>
          <Zap className="h-6 w-6 text-orange-500" />
        </div>
        <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {exercise.category}
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {exercise.testCaseCount} test cases
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium">Score: {Math.round(exercise.score * 100)}%</span>
        </div>

        <Link href={`/exercises/${exercise.exerciseId}`} className={buttonVariants({ size: 'sm', className: 'w-full' })}>
          Luyện tập <ChevronRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

function StatsCard({ stats }: { stats: StudentRecommendationStatsDto }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tổng gợi ý</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRecommendationsReceived}</div>
          <p className="text-xs text-muted-foreground">Khóa học được gợi ý</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Đã đăng ký</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={stats.engagementRate * 100} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">{Math.round(stats.engagementRate * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedCourses}</div>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={stats.completionRate * 100} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">{Math.round(stats.completionRate * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Nguồn ưa thích</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {stats.preferredSources[0] || 'Chưa có dữ liệu'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.preferredSources.length > 1
              ? `Top: ${stats.preferredSources.slice(0, 3).join(', ')}`
              : 'Bắt đầu nhận gợi ý'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function AreasCard({ weakAreas, strongAreas }: { weakAreas: string[]; strongAreas: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Phân tích kỹ năng của bạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-2 flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Điểm yếu cần cải thiện
            </h4>
            {weakAreas.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {weakAreas.map((area) => (
                  <Badge key={area} variant="destructive" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Điểm mạnh
            </h4>
            {strongAreas.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {strongAreas.map((area) => (
                  <Badge key={area} variant="default" className="text-xs bg-emerald-500">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex flex-col md:flex-row">
            <Skeleton className="w-full md:w-64 h-48 md:h-auto" />
            <div className="flex-1 p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationResponseDto | null>(null)
  const [stats, setStats] = useState<StudentRecommendationStatsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [recommendations, statsData] = await Promise.all([
        recommendationService.getRecommendations(10),
        recommendationService.getMyStats().catch(() => null)
      ])
      setData(recommendations)
      setStats(statsData)
    } catch (err) {
      setError('Không thể tải gợi ý. Vui lòng thử lại.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFeedback = async (analyticsId: string, feedback: RecommendationFeedback) => {
    try {
      await recommendationService.recordFeedback(analyticsId, feedback)
    } catch (err) {
      console.error('Failed to record feedback:', err)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Gợi ý cho bạn</h1>
          <p className="text-muted-foreground mt-1">Đang tải...</p>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container py-8 mx-auto">
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không thể tải gợi ý</h2>
          <p className="text-muted-foreground mb-4">{error || 'Đã xảy ra lỗi không xác định'}</p>
          <button onClick={fetchData} className={buttonVariants()}>
            Thử lại
          </button>
        </Card>
      </div>
    )
  }

  const hasContent = data.courses.length > 0 || data.contests.length > 0 || data.exercises.length > 0

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Gợi ý dành cho bạn
        </h1>
        <p className="text-muted-foreground mt-2">
          Dựa trên sở thích, kỹ năng và hành vi học tập của bạn •{' '}
          <span className="font-medium">{data.strategy}</span>
        </p>
      </div>

      {/* Stats */}
      {stats && <StatsCard stats={stats} />}

      {/* Areas Analysis */}
      <div className="mt-6">
        <AreasCard weakAreas={data.weakAreas} strongAreas={data.strongAreas} />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="courses" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Khóa học ({data.courses.length})
          </TabsTrigger>
          <TabsTrigger value="contests" className="gap-2">
            <Trophy className="h-4 w-4" />
            Cuộc thi ({data.contests.length})
          </TabsTrigger>
          <TabsTrigger value="exercises" className="gap-2">
            <Zap className="h-4 w-4" />
            Bài tập ({data.exercises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {data.courses.length > 0 ? (
            data.courses.map((course, index) => (
              <CourseRecommendationCard
                key={course.courseId}
                course={course}
                index={index}
                onFeedback={handleFeedback}
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có gợi ý khóa học phù hợp với bạn.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contests" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.contests.length > 0 ? (
            data.contests.map((contest) => <ContestCard key={contest.contestId} contest={contest} />)
          ) : (
            <Card className="p-8 text-center col-span-full">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có gợi ý cuộc thi phù hợp.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.exercises.length > 0 ? (
            data.exercises.map((exercise) => <ExerciseCard key={exercise.exerciseId} exercise={exercise} />)
          ) : (
            <Card className="p-8 text-center col-span-full">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có gợi ý bài tập phù hợp.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
