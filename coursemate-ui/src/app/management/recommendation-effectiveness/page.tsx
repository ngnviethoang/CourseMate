'use client'

import { useEffect, useState } from 'react'
import {
  Sparkles,
  Target,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Loader2,
  Activity
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { dashboardService } from '@/lib/dashboard-service'
import { RecommendationEffectivenessDto } from '@/lib/types'

export default function RecommendationEffectivenessPage() {
  const [data, setData] = useState<RecommendationEffectivenessDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getRecommendationEffectiveness()
        setData(res)
      } catch (err) {
        console.error('Failed to fetch recommendation effectiveness', err)
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

  if (!data) return null

  const headlineMetrics = [
    {
      title: 'Conversion Rate',
      value: `${data.overallConversionRate.toFixed(2)}%`,
      sub: `${data.convertedEnrollments} enrollments / ${data.totalRecommendations.toLocaleString()} impressions`,
      icon: Target,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      tone: data.overallConversionRate >= 2 ? 'good' : data.overallConversionRate >= 1 ? 'ok' : 'low'
    },
    {
      title: 'Học viên được cá nhân hoá',
      value: data.studentsWithPersonalizedRecommendations.toLocaleString(),
      sub: `${data.metrics.personalizedShare.toFixed(1)}% trên tổng active`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Cold-start students',
      value: data.coldStartStudents.toLocaleString(),
      sub: `${data.coldStartShare.toFixed(1)}% dùng fallback popularity`,
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Catalog Coverage',
      value: `${data.catalogCoverage.toFixed(1)}%`,
      sub: `${data.coursesShown} / ${data.coursesAvailable} khoá học`,
      icon: BookOpen,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10'
    }
  ]

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hiệu quả hệ thống Recommendation</h1>
            <p className="text-muted-foreground">
              Số liệu cho tiểu luận: đo lường tác động của gợi ý khóa học trong 30 ngày gần nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Banner */}
      <Card className="border-none shadow-lg shadow-foreground/5 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{data.metrics.personalizationStrategy}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Các tín hiệu đang được sử dụng để cá nhân hoá gợi ý:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.metrics.activeSignals.map((s, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 font-semibold">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Trung bình / user
              </p>
              <p className="text-3xl font-black text-primary">
                {data.metrics.averageEnrollmentsPerActiveStudent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">enrollments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Headline Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {headlineMetrics.map((m, i) => (
          <Card
            key={i}
            className="overflow-hidden border-none shadow-xl shadow-foreground/5 rounded-2xl transition-all hover:scale-[1.02]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {m.title}
              </CardTitle>
              <div className={`rounded-xl p-3 ${m.bg}`}>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight">{m.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{m.sub}</p>
              {m.tone && (
                <Badge
                  variant="outline"
                  className={`mt-3 ${
                    m.tone === 'good'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : m.tone === 'ok'
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}
                >
                  {m.tone === 'good' ? 'Hiệu quả tốt' : m.tone === 'ok' ? 'Trung bình' : 'Cần cải thiện'}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart + Personalization Ratio */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Xu hướng 14 ngày</CardTitle>
                <CardDescription>
                  Số lượt gợi ý vs lượt đăng ký thực tế mỗi ngày.
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="h-[360px] pl-2 pt-4">
            {data.dailyTrend.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Chưa có đủ dữ liệu trong 14 ngày gần nhất.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyTrend}>
                  <defs>
                    <linearGradient id="recImpression" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="recEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="recommendations" stroke="#3B82F6" fill="url(#recImpression)" name="Lượt gợi ý" />
                  <Area type="monotone" dataKey="enrollments" stroke="#10B981" fill="url(#recEnroll)" name="Đăng ký" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Tỉ lệ cá nhân hoá</CardTitle>
            <CardDescription>Số học viên đã có dữ liệu mua hàng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-semibold">Cá nhân hoá</span>
                <span className="text-2xl font-black text-primary">
                  {data.metrics.personalizedShare.toFixed(1)}%
                </span>
              </div>
              <Progress value={data.metrics.personalizedShare} className="h-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                {data.studentsWithPersonalizedRecommendations.toLocaleString()} / {data.activeStudents.toLocaleString()} active students
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Conversion Rate đạt được
                  </p>
                  <p className="text-xl font-black">
                    {data.overallConversionRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed p-4 text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Cách đo lường</p>
              <p className="mt-1">
                Conversion Rate = số đăng ký mới trong 30 ngày / tổng impression gợi ý (số học viên có dữ liệu × số khoá học
                có thể gợi ý). Các số liệu được tính từ Orders, OrderItems và Courses hiện có.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Converting Courses */}
      <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-6">
          <div>
            <CardTitle className="text-xl font-bold">Top khoá học có conversion cao nhất</CardTitle>
            <CardDescription>Được đề xuất → học viên thực sự đăng ký.</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="p-0">
          {data.topConvertingCourses.length === 0 ? (
            <div className="px-8 py-12 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu chuyển đổi. Hãy đợi thêm đơn hàng phát sinh từ gợi ý.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50 h-14">
                <TableRow>
                  <TableHead className="px-8 font-bold">Khoá học</TableHead>
                  <TableHead className="px-8 font-bold">Danh mục</TableHead>
                  <TableHead className="text-right px-8 font-bold">Lượt gợi ý</TableHead>
                  <TableHead className="text-right px-8 font-bold">Đăng ký</TableHead>
                  <TableHead className="text-right px-8 font-bold">Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topConvertingCourses.map(c => (
                  <TableRow key={c.id} className="h-16 hover:bg-muted/30 transition-colors">
                    <TableCell className="px-8 font-semibold">{c.title}</TableCell>
                    <TableCell className="px-8">
                      <Badge variant="secondary">{c.categoryName}</Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 font-medium">
                      {c.recommendedViews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right px-8 font-bold text-primary">
                      {c.enrollments.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-bold">
                        {c.conversionRate.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Hiệu quả theo danh mục</CardTitle>
          <CardDescription>
            Cho thấy danh mục nào được học viên đăng ký nhiều nhất khi được gợi ý.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.categoryBreakdown.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu theo danh mục.
            </div>
          ) : (
            <div className="space-y-4">
              {data.categoryBreakdown.map((cat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="font-semibold">{cat.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {cat.enrollments} đăng ký / {cat.recommendedViews.toLocaleString()} gợi ý
                      </span>
                      <Badge className="bg-primary/10 text-primary border-none font-bold">
                        {cat.conversionRate.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={Math.min(cat.conversionRate * 20, 100)} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}