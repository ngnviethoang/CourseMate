'use client'

import { ReadingContent } from '@/components/learning/lesson-content.types'

function renderMarkdown(markdown: string) {
  return markdown.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return (
        <h1 key={index} className="mb-3 mt-7 text-2xl font-bold text-primary">
          {line.slice(2)}
        </h1>
      )
    }

    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="mb-2.5 mt-5 inline-block border-b-2 border-primary/10 pb-1 text-xl font-bold">
          {line.slice(3)}
        </h2>
      )
    }

    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="mb-2 mt-4 text-lg font-semibold text-foreground/80">
          {line.slice(4)}
        </h3>
      )
    }

    if (line.startsWith('```')) {
      return null
    }

    if (line.startsWith('- ')) {
      return (
        <li key={index} className="mb-2 ml-6 list-disc text-[15px] leading-relaxed text-muted-foreground">
          {line.slice(2)}
        </li>
      )
    }

    if (line.startsWith('> ')) {
      return (
        <blockquote
          key={index}
          className="my-5 rounded-r-xl border-l-4 border-primary bg-primary/5 py-3.5 pl-5 text-base italic text-foreground/80"
        >
          {line.slice(2)}
        </blockquote>
      )
    }

    if (line.trim() === '') {
      return <div key={index} className="h-4" />
    }

    return (
      <p key={index} className="mb-3 text-[15px] leading-relaxed text-muted-foreground">
        {line}
      </p>
    )
  })
}

export function ReadingLessonContent({ content }: { content: ReadingContent }) {
  return (
    <div className="w-full py-4">
      <div className="prose prose-slate max-w-none dark:prose-invert">{renderMarkdown(content.markdown_content)}</div>
    </div>
  )
}
