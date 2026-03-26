'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { studentService } from '@/lib/student-service'
import { Loader2 } from 'lucide-react'

export default function LearningRedirectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    studentService.getCourseById(id).then(course => {
      if (course && course.chapters.length > 0 && course.chapters[0].lessons.length > 0) {
        router.replace(`/learning/${id}/${course.chapters[0].lessons[0].id}`)
      }
    }).catch(() => { /* handled by layout or service */ })
  }, [id, router])

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
