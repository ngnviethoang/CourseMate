'use client'

import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useFavorites } from '@/contexts/favorites-context'
import type { CourseDto } from '@/lib/types'
import { useState } from 'react'

interface CourseBrowseCardProps {
  course: CourseDto
  onClick?: () => void
}

export function CourseBrowseCard({ course, onClick }: CourseBrowseCardProps) {
  const { toggle, isFavorited } = useFavorites()
  const [heartLoading, setHeartLoading] = useState(false)
  const favorited = isFavorited(course.id)

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (heartLoading) return
    setHeartLoading(true)
    try {
      await toggle(course.id)
    } finally {
      setHeartLoading(false)
    }
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col"
      onClick={onClick ?? (() => { window.location.href = `/courses/${course.id}` })}
    >
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {course.categoryName && (
          <Badge className="absolute left-2 top-2 bg-black/60 hover:bg-black/60 text-white border-0 backdrop-blur-sm">
            {course.categoryName}
          </Badge>
        )}

        {/* Heart Button */}
        <button
          onClick={handleHeartClick}
          disabled={heartLoading}
          className={`absolute right-2 top-2 rounded-full p-1.5 transition-all duration-200 ${
            favorited
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
              : 'bg-black/40 text-white/80 hover:bg-black/60 backdrop-blur-sm'
          }`}
          aria-label={favorited ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
          <Heart
            className={`h-4 w-4 transition-transform duration-200 ${favorited ? 'scale-110 fill-current' : ''}`}
          />
        </button>
      </div>

      <CardHeader className="p-4 pb-2 flex-none">
        <CardTitle className="line-clamp-2 text-base leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-xs mt-1">
          {course.instructorName || 'Đang cập nhật'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto">
        <span className="text-lg font-bold text-primary">{formatCurrency(course.price)}</span>
        <span className="text-xs font-semibold text-primary underline-offset-2 group-hover:underline">
          Xem chi tiết
        </span>
      </CardFooter>
    </Card>
  )
}
