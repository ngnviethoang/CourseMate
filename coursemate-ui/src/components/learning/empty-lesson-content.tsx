'use client'

import { Button } from '@/components/ui/button'
import { Code2, FileText, HelpCircle, PlayCircle, Presentation } from 'lucide-react'
import { LessonType } from '@/lib/types'

const lessonTypeConfig: Record<LessonType, { label: string; icon: React.ReactNode }> = {
  [LessonType.Video]: { label: 'video', icon: <PlayCircle className="h-8 w-8" /> },
  [LessonType.Reading]: { label: 'bài đọc', icon: <FileText className="h-8 w-8" /> },
  [LessonType.Coding]: { label: 'lập trình', icon: <Code2 className="h-8 w-8" /> },
  [LessonType.Quiz]: { label: 'trắc nghiệm', icon: <HelpCircle className="h-8 w-8" /> },
  [LessonType.Slide]: { label: 'slide', icon: <Presentation className="h-8 w-8" /> }
}

export function EmptyLessonContent({ lessonType, onBack }: { lessonType: LessonType; onBack: () => void }) {
  const config = lessonTypeConfig[lessonType]

  return (
    <div className="flex flex-col items-center justify-center space-y-5 rounded-2xl border border-dashed border-border bg-muted/20 px-7 py-16 text-center shadow-inner">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-md">
        {config?.icon ?? <FileText className="h-8 w-8" />}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Nội dung sẽ sớm có</h3>
        <p className="max-w-sm text-[13px] text-muted-foreground">
          Chúng tôi đang chuẩn bị nội dung {config?.label ?? 'bài học'} cho phần này. Vui lòng quay lại sau.
        </p>
      </div>
      <Button variant="secondary" onClick={onBack}>
        Xem giáo trình
      </Button>
    </div>
  )
}
