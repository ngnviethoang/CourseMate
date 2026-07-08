'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Code2,
  Trophy,
  Sparkles,
  ArrowRight,
  Loader2,
  Award,
  Activity,
  Calendar,
  Zap
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList
} from 'recharts'
import { dashboardService } from '@/lib/dashboard-service'
import { StudentSkillAnalysisDto } from '@/lib/types'
import { toast } from 'sonner'

const SKILL_LEVEL_COLORS: Record<string, string> = {
  'Xuất sắc': 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  'Thành thạo': 'bg-blue-500/10 text-blue-700 border-blue-200',
  'Trung bình': 'bg-amber-500/10 text-amber-700 border-amber-200',
  'Sơ cấp': 'bg-orange-500/10 text-orange-700 border-orange-200',
  'Mới bắt đầu': 'bg-rose-500/10 text-rose-700 border-rose-200',
  'Chưa có dữ liệu': 'bg-slate-500/10 text-slate-700 border-slate-200'
}

function getMasteryColor(masteryScore: number, isWeak: boolean): string {
  // Yếu: dùng tông đỏ từ đậm -> nhạt theo mastery tăng
  if (isWeak) {
    if (masteryScore <= 10) return '#B91C1C'   // đỏ đậm (rất yếu / 0%)
    if (masteryScore <= 25) return '#DC2626'   // đỏ vừa
    if (masteryScore <= 40) return '#F87171'   // đỏ nhạt
    return '#FCA5A5'                            // hồng (sắp qua ngưỡng 50%)
  }
  // Mạnh: dùng tông xanh từ nhạt -> đậm theo mastery tăng
  if (masteryScore >= 90) return '#059669'     // xanh đậm (xuất sắc)
  if (masteryScore >= 75) return '#10B981'     // xanh vừa
  if (masteryScore >= 60) return '#34D399'     // xanh nhạt
  return '#6EE7B7'                              // xanh rất nhạt (vừa khá)
}

export default function SkillAnalysisPage() {
  const router = useRouter()
  const [data, setData] = useState<StudentSkillAnalysisDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getStudentSkillAnalysis()
        setData(res)
      } catch (err) {
        console.error('Failed to fetch skill analysis', err)
        toast.error('Không thể tải phân tích năng lực. Hãy thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Không có dữ liệu để phân tích.</p>
      </div>
    )
  }

  const hasNoData = data.overall.totalAttempts === 0
  const skillLevelColor = SKILL_LEVEL_COLORS[data.overall.skillLevel] || SKILL_LEVEL_COLORS['Chưa có dữ liệu']

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
         
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phân tích năng lực của bạn</h1>
            <p className="text-muted-foreground">
              Hệ thống phân tích dựa trên các bài tập bạn đã làm để chỉ ra điểm mạnh, điểm yếu và gợi ý cải thiện.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {hasNoData && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
          <CardContent className="p-10 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Chào mừng bạn đến với CourseMate!</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Bạn chưa có dữ liệu bài tập nào. Hãy bắt đầu làm một vài bài tập để hệ thống có thể phân tích năng lực và
              gợi ý khoá học phù hợp.
            </p>
            <Button size="lg" onClick={() => router.push('/exercises')} className="rounded-full">
              <Code2 className="mr-2 h-5 w-5" />
              Bắt đầu làm bài tập
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overall Mastery Card */}
      {!hasNoData && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-0 md:grid-cols-3">
              <div className="md:col-span-2 p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Trình độ tổng thể
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-6xl font-black text-primary">{data.overall.masteryScore.toFixed(0)}</span>
                  <span className="text-2xl font-bold text-muted-foreground">/ 100</span>
                </div>
                <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold ${skillLevelColor}`}>
                  {data.overall.skillLevel}
                </Badge>
                <p className="mt-4 text-sm text-muted-foreground">
                  Điểm năng lực = tỉ lệ đúng × 70% + điểm trung bình × 30%, tính trên tất cả chủ đề.
                </p>
              </div>

              <div className="p-8 grid grid-cols-2 gap-4 border-l">
                <MetricCell label="Lượt làm" value={data.overall.totalAttempts.toLocaleString()} icon={Activity} />
                <MetricCell label="Đã đúng" value={data.overall.passedAttempts.toLocaleString()} icon={CheckCircle2} />
                <MetricCell label="Tỉ lệ đúng" value={`${data.overall.passRate.toFixed(1)}%`} icon={Target} />
                <MetricCell
                  label="Số bài đã thử"
                  value={data.overall.attemptedExercises.toLocaleString()}
                  icon={Code2}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Areas - Hero Section */}
      {data.weakAreas.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-rose-500" />
                Điểm yếu của bạn
              </CardTitle>
              <CardDescription>
                {data.weakAreas.length} chủ đề bạn cần cải thiện để nâng cao năng lực.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-200 font-bold">
              {data.weakAreas.length} điểm yếu
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.weakAreas.map((area, i) => (
              <WeakAreaCard key={i} area={area} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {data.strengths.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              Điểm mạnh của bạn
            </CardTitle>
            <CardDescription>Những chủ đề bạn đang làm tốt — hãy tiếp tục duy trì phong độ.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {data.strengths.map((area, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 p-4 transition-all hover:bg-emerald-50/60"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{area.category}</h3>
                        <Badge variant="outline" className="bg-background text-xs">
                          {area.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{area.summary}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-600">{area.masteryScore.toFixed(0)}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Mastery</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {area.passedAttempts}/{area.totalAttempts} bài đúng
                    </span>
                    <span className="font-bold text-emerald-700">{area.passRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={area.passRate} className="h-1.5 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Progress Chart */}
      {data.recentProgress.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Xu hướng 14 ngày gần nhất</CardTitle>
                <CardDescription>Số bài tập đã làm và tỉ lệ đúng mỗi ngày.</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.recentProgress}>
                <defs>
                  <linearGradient id="submissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="passed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#3B82F6"
                  fill="url(#submissions)"
                  name="Lượt làm"
                />
                <Area type="monotone" dataKey="passed" stroke="#10B981" fill="url(#passed)" name="Lượt đúng" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Mastery Bar Chart by Category */}
      {data.strengths.length + data.weakAreas.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Bản đồ năng lực theo chủ đề</CardTitle>
            <CardDescription>
              Điểm Mastery 0–100 cho từng chủ đề (đỏ đậm = rất yếu, đỏ nhạt = yếu, xanh nhạt = trung bình, xanh đậm = rất mạnh).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[...data.weakAreas, ...data.strengths].map(a => ({
                  name: `${a.category} (${a.difficulty})`,
                  mastery: Math.max(a.masteryScore, 0.01),
                  masteryRaw: a.masteryScore,
                  isWeak: a.isWeakArea
                }))}
                margin={{ left: 80, right: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  width={150}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number, _name: string, props: { payload?: { masteryRaw: number; isWeak: boolean } }) => {
                    const raw = props.payload?.masteryRaw ?? value
                    return [`${raw.toFixed(1)}%`, 'Mastery']
                  }}
                />
                <Bar dataKey="mastery" radius={[0, 6, 6, 0]}>
                  {[...data.weakAreas, ...data.strengths].map((a, i) => (
                    <Cell
                      key={i}
                      fill={getMasteryColor(a.masteryScore, a.isWeakArea)}
                    />
                  ))}
                  <LabelList
                    dataKey="masteryRaw"
                    position="right"
                    formatter={(v: number) => `${v.toFixed(1)}%`}
                    style={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {data.tips.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              Lời khuyên cho bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white/60 p-3 border">
                <Zap className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommended Exercises */}
      {data.recommendedExercises.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Code2 className="h-6 w-6 text-blue-500" />
              Bài tập nên luyện tiếp
            </CardTitle>
            <CardDescription>Được chọn dựa trên các điểm yếu của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {data.recommendedExercises.map(ex => (
                <div
                  key={ex.id}
                  className="group cursor-pointer rounded-xl border p-4 transition-all hover:border-primary/40 hover:shadow-md"
                  onClick={() => router.push(`/exercises/${ex.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                      {ex.title}
                    </h3>
                    <Badge variant="outline" className="ml-2 flex-shrink-0 text-xs">
                      {ex.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{ex.reason}</p>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {ex.category}
                    </Badge>
                    <span className="text-muted-foreground">bởi {ex.creatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Courses */}
      {data.recommendedCourses.length > 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-violet-500" />
              Khoá học nên học
            </CardTitle>
            <CardDescription>Khoá học giúp bạn cải thiện các chủ đề đang yếu.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.recommendedCourses.map(course => (
                <div
                  key={course.id}
                  className="group cursor-pointer rounded-xl border p-4 transition-all hover:border-primary/40 hover:shadow-md"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  <Badge variant="secondary" className="text-xs mb-2">
                    {course.categoryName}
                  </Badge>
                  <h3 className="font-bold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.reason}</p>
                  <p className="text-xs text-muted-foreground">GV: {course.instructorName}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No weak areas, no recommendations */}
      {!hasNoData && data.weakAreas.length === 0 && data.recommendedExercises.length === 0 && (
        <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardContent className="p-10 text-center">
            <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Bạn đang làm rất tốt!</h2>
            <p className="text-muted-foreground mb-6">
              Hiện tại chưa phát hiện điểm yếu rõ ràng. Hãy thử thách bản thân với các bài tập Khó hơn.
            </p>
            <Button onClick={() => router.push('/exercises')} className="rounded-full">
              <TrendingUp className="mr-2 h-4 w-4" />
              Luyện bài Khó hơn
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricCell({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  )
}

function WeakAreaCard({ area }: { area: any }) {
  return (
    <div className="rounded-xl border-2 border-rose-200/50 bg-rose-50/30 p-5 transition-all hover:bg-rose-50/60">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">{area.category}</h3>
            <Badge variant="outline" className="bg-white text-xs">
              {area.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-300 text-xs font-bold">
              Điểm yếu
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{area.summary}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-3xl font-black text-rose-600">{area.masteryScore.toFixed(0)}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Mastery</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Tỉ lệ đúng</span>
          <span className="font-bold text-rose-700">{area.passRate.toFixed(0)}% ({area.passedAttempts}/{area.totalAttempts})</span>
        </div>
        <Progress value={area.passRate} className="h-2" />
      </div>

      {area.improvementHints?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-rose-200/50">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" />
            Gợi ý cải thiện
          </p>
          <ul className="space-y-1.5">
            {area.improvementHints.map((hint: string, i: number) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <ArrowRight className="h-3.5 w-3.5 mt-1 flex-shrink-0 text-rose-500" />
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}