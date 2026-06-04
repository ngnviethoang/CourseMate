import Link from 'next/link'
import { Play, CheckCircle2, BarChart2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { StudentMyCourseDto } from '@/lib/types'

export function CourseCard({ course }: { course: StudentMyCourseDto }) {
  const done = course.progressPercentage === 100

  return (
    <div className="group rounded-3xl bg-card shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
      <div className="relative overflow-hidden aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl || 'https://placehold.co/600x340/6366f1/ffffff?text=Course'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50" />

        {done && (
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-background rounded-full p-4 shadow-2xl scale-110">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none shadow-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
            {course.categoryName}
          </Badge>
          {done && (
            <Badge className="bg-emerald-500 text-white border-none shadow-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
              Hoàn thành
            </Badge>
          )}
        </div>

        {/* Play Overlay (Visible on Hover if not done) */}
        {!done && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-primary/90 text-primary-foreground rounded-full p-4 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <Play className="h-8 w-8 fill-current ml-1" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 relative bg-card">
        {/* Progress Bar moved up connecting image and content */}
        <div className="absolute top-0 left-0 right-0 -mt-1 h-1 bg-muted overflow-hidden z-10">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              done
                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                : 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]'
            }`}
            style={{ width: `${course.progressPercentage}%` }}
          />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">GV</span>
            </div>
            {course.instructorName || 'Giảng viên CourseMate'}
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tiến độ</span>
              <span className={`text-base font-black leading-none ${done ? 'text-emerald-600' : 'text-foreground'}`}>
                {Math.round(course.progressPercentage)}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {course.completedLessons}/{course.totalLessons} bài
              </span>
            </div>
          </div>

          <p className="mb-3 text-xs font-medium text-muted-foreground line-clamp-1 h-4">
            {done
              ? '🎉 Chúc mừng bạn đã hoàn thành xuất sắc!'
              : course.lastLessonTitle
                ? `Đang học: ${course.lastLessonTitle}`
                : 'Hãy bắt đầu bài học đầu tiên'}
          </p>

          <Link
            href={`/learning/${course.id}`}
            className={buttonVariants({
              variant: done ? 'outline' : 'default',
              className: `w-full rounded-xl h-10 text-sm font-bold transition-all duration-300 ${
                !done
                  ? 'shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5'
                  : 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
              }`
            })}
          >
            {done ? (
              <>
                <BarChart2 className="h-4 w-4 mr-2" /> Xem lại khóa học
              </>
            ) : course.progressPercentage === 0 ? (
              <>
                <Play className="h-4 w-4 mr-2 fill-current" /> Bắt đầu ngay
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 fill-current" /> Tiếp tục bài học
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
