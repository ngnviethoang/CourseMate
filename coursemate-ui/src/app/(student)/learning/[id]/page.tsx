'use client'

import { courseService } from '@/lib/course-service'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LearningRedirectPage() {
 const { id } = useParams<{ id: string }>()
 const router = useRouter()

 useEffect(() => {
 const fetchCourse = async () => {
 if (!id) return
 try {
 const course = await courseService.getById(id)
 if (course && course.chapters.length > 0 && course.chapters[0].lessons.length > 0) {
 router.replace(`/learning/${id}/${course.chapters[0].lessons[0].id}`)
 }
 } catch {
 /* handled by layout or service */
 }
 }
 fetchCourse()
 }, [id, router])

 return (
 <div className="flex h-[80vh] items-center justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 )
}
