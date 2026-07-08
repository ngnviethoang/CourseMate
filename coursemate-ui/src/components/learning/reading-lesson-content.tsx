'use client'

import { ReadingContent } from '@/components/learning/lesson-content.types'

export function ReadingLessonContent({ content }: { content: ReadingContent }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <article
        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: content.markdown_content }}
      />
    </div>
  )
}
