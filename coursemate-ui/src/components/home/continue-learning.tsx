'use client'

import { ChevronRight, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const enrolledCourses = [
  {
    id: 1,
    title: 'React – The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    progress: 68,
    totalLessons: 60,
    completedLessons: 41,
    thumbnail: 'https://placehold.co/400x225/6366f1/ffffff?text=React',
    category: 'Development'
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    instructor: 'Daniel Walter Scott',
    progress: 35,
    totalLessons: 48,
    completedLessons: 17,
    thumbnail: 'https://placehold.co/400x225/ec4899/ffffff?text=UI%2FUX',
    category: 'Design'
  },
  {
    id: 3,
    title: 'Python for Data Science & AI',
    instructor: 'Jose Portilla',
    progress: 12,
    totalLessons: 95,
    completedLessons: 11,
    thumbnail: 'https://placehold.co/400x225/10b981/ffffff?text=Python',
    category: 'Data Science'
  }
]

export function ContinueLearning() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <p className="text-sm text-muted-foreground">Pick up where you left off</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          See all <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map(course => (
          <Card key={course.id} className="group cursor-pointer transition-shadow hover:shadow-md">
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                  <Play className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <Badge className="absolute left-3 top-3 bg-background/90 text-foreground shadow-sm">
                {course.category}
              </Badge>
            </div>

            <CardHeader className="pb-1">
              <CardTitle className="line-clamp-2 leading-snug">{course.title}</CardTitle>
              <CardDescription>{course.instructor}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-1.5 pb-0">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{course.progress}% complete</span>
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>
              </div>
              <Progress value={course.progress} />
            </CardContent>

            <CardFooter>
              <Button size="sm" className="w-full rounded-full">
                <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
