'use client'

import { ChevronRight, Clock, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const recommendedCourses = [
  {
    id: 4,
    title: 'Next.js 15 – Full Stack Development',
    instructor: 'Lee Robinson',
    rating: 4.9,
    students: 18_400,
    duration: '32h',
    price: 89,
    thumbnail: 'https://placehold.co/400x225/0ea5e9/ffffff?text=Next.js',
    category: 'Development',
    badge: 'Bestseller'
  },
  {
    id: 5,
    title: 'Advanced CSS & Sass',
    instructor: 'Jonas Schmedtmann',
    rating: 4.8,
    students: 12_700,
    duration: '28h',
    price: 74,
    thumbnail: 'https://placehold.co/400x225/a855f7/ffffff?text=CSS',
    category: 'Design',
    badge: 'New'
  },
  {
    id: 6,
    title: 'Machine Learning A-Z',
    instructor: 'Kirill Eremenko',
    rating: 4.7,
    students: 24_900,
    duration: '44h',
    price: 99,
    thumbnail: 'https://placehold.co/400x225/f59e0b/ffffff?text=ML',
    category: 'Data Science',
    badge: 'Top Rated'
  },
  {
    id: 7,
    title: 'Digital Marketing Strategy',
    instructor: 'Ira Nersesova',
    rating: 4.6,
    students: 9_300,
    duration: '18h',
    price: 59,
    thumbnail: 'https://placehold.co/400x225/ef4444/ffffff?text=Marketing',
    category: 'Business',
    badge: null
  }
]

export function RecommendedCourses() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">Based on your interests</p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          View more <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendedCourses.map(course => (
          <Card key={course.id} className="group cursor-pointer transition-shadow hover:shadow-md">
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {course.badge && (
                <Badge
                  className={`absolute left-2 top-2 text-[10px] shadow-sm ${
                    course.badge === 'Bestseller'
                      ? 'bg-amber-500 text-white'
                      : course.badge === 'New'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-500 text-white'
                  }`}
                >
                  {course.badge}
                </Badge>
              )}
            </div>

            <CardHeader className="pb-1">
              <CardTitle className="line-clamp-2 text-sm leading-snug">{course.title}</CardTitle>
              <CardDescription className="text-xs">{course.instructor}</CardDescription>
            </CardHeader>

            <CardContent className="pb-1">
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">({course.students.toLocaleString()})</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {course.duration}
                <Users className="h-3 w-3" />
                {course.students.toLocaleString()} students
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <span className="text-sm font-bold">${course.price}</span>
              <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs">
                Enroll
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
