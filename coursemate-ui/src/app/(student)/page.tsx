'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { categoryService } from '@/lib/category-service'
import { courseService } from '@/lib/course-service'
import { CourseDto, CategoryDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function CatalogPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.list({ pageSize: 50, hasCourse: true })
        setCategories(res.items || [])
      } catch {}
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await courseService.list({ pageIndex: 0, pageSize: 50, filter: search })
        if (!cancelled) setCourses(res.items || [])
      } catch {
        if (!cancelled) toast.error('Failed to load courses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    setLoading(true)
    load()
    return () => {
      cancelled = true
    }
  }, [search])

  const filteredCourses = selectedCategory ? courses.filter(c => c.categoryId === selectedCategory) : courses

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-muted-foreground mt-2">Discover the best courses tailored for you.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Badge
            variant={selectedCategory === '' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('')}
          >
            All
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse h-72 bg-muted"></Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No courses found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map(course => (
            <Card
              key={course.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg flex flex-col"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute right-2 top-2 bg-black/50 hover:bg-black/50 text-white border-0 backdrop-blur-sm">
                  {course.categoryName}
                </Badge>
              </div>

              <CardHeader className="p-4 pb-2 flex-none">
                <CardTitle className="line-clamp-2 text-base leading-tight group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {course.instructorName || 'Unknown Instructor'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-0 flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground mt-2">{course.description}</p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex items-center justify-between shadow-md border-0 border-t-0 mt-auto">
                <span className="text-lg font-bold text-primary">{formatCurrency(course.price)}</span>
                <Button size="sm" variant="default" className="rounded-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
