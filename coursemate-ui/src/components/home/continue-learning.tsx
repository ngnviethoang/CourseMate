'use client'

import { orderService } from '@/lib/order-service'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Play, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { OrderDto } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

// Category colour mapping based on course title keywords
function getCategoryColor(title: string) {
  const t = title.toLowerCase()
  if (
    t.includes('react') ||
    t.includes('next') ||
    t.includes('develop') ||
    t.includes('javascript') ||
    t.includes('typescript')
  )
    return { label: 'Development', color: 'bg-indigo-500' }
  if (t.includes('design') || t.includes('figma') || t.includes('ui') || t.includes('ux') || t.includes('css'))
    return { label: 'Design', color: 'bg-pink-500' }
  if (t.includes('data') || t.includes('machine') || t.includes('python') || t.includes('ai') || t.includes('ml'))
    return { label: 'Data Science', color: 'bg-emerald-500' }
  if (t.includes('market') || t.includes('business')) return { label: 'Business', color: 'bg-amber-500' }
  return { label: 'Course', color: 'bg-primary' }
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="h-40 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-full" />
      </div>
    </div>
  )
}

export function ContinueLearning() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.list({ pageIndex: 0, pageSize: 6 })
        setOrders(res.items)
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Flatten all items from completed/paid orders
  const enrolledItems = orders
    .filter(o => o.status === 'Paid') // status Paid
    .flatMap(o => o.items)

  if (loading) {
    return (
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <p className="text-sm text-muted-foreground">Pick up where you left off</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (enrolledItems.length === 0) return null

  // Show up to 3 courses
  const displayItems = enrolledItems.slice(0, 3)

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <p className="text-sm text-muted-foreground">Pick up where you left off</p>
        </div>
        <Link
          href="/orders"
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'gap-1 text-primary' })}
        >
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item, idx) => {
          const { label, color } = getCategoryColor(item.courseTitle)
          // Static progress — no progress API yet
          const progressValues = [68, 35, 12, 55, 80, 22]
          const progress = progressValues[idx % progressValues.length]

          return (
            <Card
              key={item.id}
              className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 duration-200 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item.courseImageUrl ||
                    `https://placehold.co/400x225/6366f1/ffffff?text=${encodeURIComponent(item.courseTitle.slice(0, 15))}`
                  }
                  alt={item.courseTitle}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => {
                    ;(e.target as HTMLImageElement).src = `https://placehold.co/400x225/6366f1/ffffff?text=Course`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-5 w-5 text-foreground" />
                  </div>
                </div>
                <Badge className={`absolute left-3 top-3 ${color} text-white shadow-sm`}>{label}</Badge>
              </div>

              <CardHeader className="pb-1">
                <Link href={`/courses/${item.courseId}`}>
                  <CardTitle className="line-clamp-2 leading-snug text-sm hover:text-primary transition-colors">
                    {item.courseTitle}
                  </CardTitle>
                </Link>
                <CardDescription className="text-xs">{formatCurrency(item.price)}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-1.5 pb-0">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{progress}% complete</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> In progress
                  </span>
                </div>
                <Progress value={progress} />
              </CardContent>

              <CardFooter>
                <Link
                  href={`/courses/${item.courseId}`}
                  className={buttonVariants({ size: 'sm', className: 'w-full rounded-full' })}
                >
                  <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
