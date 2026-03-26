'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  Loader2
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { dashboardService } from '@/lib/admin-service'
import { authService } from '@/lib/auth-service'
import { DashboardDto, ProfileDto } from '@/lib/types'
import { formatCurrency, cn } from '@/lib/utils'

export default function ManagementPage() {
  const [data, setData] = useState<DashboardDto | null>(null)
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userProfile = await authService.getProfile()
        setProfile(userProfile)
        
        const isAdmin = userProfile.roles.includes('Admin')
        const res = isAdmin 
          ? await dashboardService.getAdminStats() 
          : await dashboardService.getInstructorStats()
          
        setData(res)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  const stats = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Học viên',
      value: data.totalStudents.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Khoá học',
      value: data.totalCourses.toLocaleString(),
      icon: BookOpen,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10'
    },
    {
      title: 'Đơn hàng',
      value: data.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  ]

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard Quản lý</h1>
        <p className="text-lg text-muted-foreground">Tổng quan về hoạt động kinh doanh và hiệu suất của nền tảng.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-xl shadow-foreground/5 rounded-2xl transition-all hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tight">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5 font-medium">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>+12.5% từ tháng trước</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-foreground/5 rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold">Doanh thu theo tháng</CardTitle>
            <CardDescription className="text-base font-medium">Biểu đồ doanh thu 12 tháng gần nhất.</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] pl-2 pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByMonth}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Instructors (Admin only) or Placeholder for Instructor */}
        {profile?.roles.includes('Admin') ? (
          <Card className="lg:col-span-3 border-none shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground py-6">
              <div>
                <CardTitle className="text-xl font-bold">Cá nhân xuất sắc</CardTitle>
                <CardDescription className="text-primary-foreground/70 font-medium">Top giảng viên có doanh thu cao nhất.</CardDescription>
              </div>
              <BarChart3 className="h-6 w-6" />
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-8">
                {data.topInstructors.map((instructor, i) => (
                  <div key={instructor.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-bold leading-none">{instructor.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">{instructor.courseCount} khoá học đã giảng dạy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black tracking-tight">{formatCurrency(instructor.totalRevenue)}</div>
                      <Badge variant="outline" className="text-[11px] font-bold px-2 py-0 h-5 mt-1 border-emerald-200 bg-emerald-50 text-emerald-700">Level {4 - i}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Mẹo tăng doanh thu</CardTitle>
              <CardDescription>Cách để khoá học của bạn tiếp cận nhiều học viên hơn.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'Cập nhật nội dung bài giảng thường xuyên.',
                  'Tương tác với học viên qua phần thảo luận.',
                  'Tối ưu hóa hình ảnh và mô tả khoá học.',
                  'Sử dụng mã giảm giá để thu hút học viên mới.'
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Courses Table */}
      <Card className="border-none shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between py-6">
          <div>
            <CardTitle className="text-2xl font-bold">Khoá học bán chạy</CardTitle>
            <CardDescription className="text-base font-medium">Danh sách các khoá học có hiệu suất tốt nhất.</CardDescription>
          </div>
          <Link 
            href="/management/courses" 
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "flex items-center gap-2 h-12 rounded-xl px-6 border-muted-foreground/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all")}
          >
            Quản lý khoá học <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 h-16">
              <TableRow>
                <TableHead className="text-base font-bold px-8">Tên khoá học</TableHead>
                <TableHead className="text-right text-base font-bold px-8">Học viên</TableHead>
                <TableHead className="text-right text-base font-bold px-8">Doanh thu</TableHead>
                <TableHead className="text-right text-base font-bold px-8">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCourses.map((course) => (
                <TableRow key={course.id} className="h-20 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold text-lg px-8">{course.title}</TableCell>
                  <TableCell className="text-right text-lg font-medium px-8">{course.enrollmentCount} học viên</TableCell>
                  <TableCell className="text-right font-black text-xl px-8 text-primary">{formatCurrency(course.revenue)}</TableCell>
                  <TableCell className="text-right px-8">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 text-sm font-bold rounded-full">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
