'use client'

import { Button } from '@/components/ui/button'
import { Download, Presentation } from 'lucide-react'

export function SlideLessonContent({ fileUrl, title }: { fileUrl: string; title: string }) {
  return (
    <div className="space-y-5">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md">
        <iframe src={`${fileUrl}#toolbar=0`} className="h-full w-full border-0" title={title} />
        <div className="absolute right-4 top-4">
          <Button variant="secondary" size="sm" asChild className="gap-2 shadow-lg">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> Tải slide
            </a>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
          <Presentation className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-[13px] text-muted-foreground">
            Bạn có thể xem trực tiếp hoặc tải tài liệu về máy để ôn tập.
          </p>
        </div>
      </div>
    </div>
  )
}
