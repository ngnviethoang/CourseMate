'use client'

import { useState, useEffect } from 'react'
import { courseService } from '@/lib/course-service'
import { ReviewDto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, MessageCircle, User } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CourseReviewsProps {
  courseId: string
  isEnrolled: boolean
  onReviewSubmitted: () => void
}

export function CourseReviews({ courseId, isEnrolled, onReviewSubmitted }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<ReviewDto[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [isWriting, setIsWriting] = useState(false)

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true)
      const res = await courseService.getReviews(courseId, page, 10)
      if (page === 1) {
        setReviews(res.items)
      } else {
        setReviews(prev => [...prev, ...res.items])
      }
      setTotalReviews(res.totalCount)
    } catch {
      toast.error('Không thể tải đánh giá.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1)
  }, [courseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá.')
      return
    }

    try {
      setSubmitting(true)
      await courseService.reviewCourse(courseId, { rating, comment })
      toast.success('Đã gửi đánh giá thành công!')
      setComment('')
      setRating(5)
      setPageIndex(1)
      setIsWriting(false)
      await fetchReviews(1)
      onReviewSubmitted() // to trigger refresh of average rating
    } catch {
      toast.error('Không thể gửi đánh giá.')
    } finally {
      setSubmitting(false)
    }
  }

  const loadMore = () => {
    const nextPage = pageIndex + 1
    setPageIndex(nextPage)
    fetchReviews(nextPage)
  }

  return (
    <div className="space-y-6">
      {/* Form Review (Only show if enrolled) */}
      {isEnrolled && (
        !isWriting ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/40 p-5 rounded-xl border border-border gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" /> Bạn thấy khóa học này thế nào?
              </h3>
              <p className="text-sm text-muted-foreground">Chia sẻ trải nghiệm của bạn để giúp những người khác.</p>
            </div>
            <Button onClick={() => setIsWriting(true)} variant="default" className="shrink-0">
              Viết đánh giá
            </Button>
          </div>
        ) : (
          <Card className="border-border bg-background shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" /> Đánh giá khóa học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-muted-foreground">
                    {rating === 5 && 'Tuyệt vời'}
                    {rating === 4 && 'Rất tốt'}
                    {rating === 3 && 'Bình thường'}
                    {rating === 2 && 'Tệ'}
                    {rating === 1 && 'Rất tệ'}
                  </span>
                </div>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
                  className="min-h-[80px] resize-y text-sm"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={submitting}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsWriting(false)} disabled={submitting}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )
      )}

      {/* Danh sách Review */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold">Các đánh giá ({totalReviews})</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-xl border-dashed">
            Chưa có đánh giá nào cho khóa học này.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map(review => (
              <Card key={review.id} className="border-border bg-background shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {review.studentAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={review.studentAvatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{review.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-line">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {reviews.length < totalReviews && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? 'Đang tải...' : 'Xem thêm đánh giá'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
