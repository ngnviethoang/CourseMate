'use client'

import { PlayCircle } from 'lucide-react'
import { VideoContent } from '@/components/learning/lesson-content.types'

export function VideoLessonContent({
  content,
  videoUrl,
  title
}: {
  content?: VideoContent | null
  videoUrl?: string
  title: string
}) {
  const player = videoUrl ? (
    <div className="aspect-video overflow-hidden rounded-3xl bg-slate-950 shadow-2xl ring-1 ring-white/10">
      {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
        <iframe
          className="h-full w-full"
          src={videoUrl.replace('watch?v=', 'embed/')}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={videoUrl} controls className="h-full w-full" controlsList="nodownload" />
      )}
    </div>
  ) : (
    <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <PlayCircle className="h-16 w-16 cursor-pointer text-white/50 transition-all group-hover:scale-110 group-hover:text-white" />
      <div className="absolute bottom-4 left-4 right-4 translate-y-2 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-white/70">Khu vực phát video sẽ hiển thị tại đây</p>
      </div>
    </div>
  )

  if (!content) {
    return player
  }

  return (
    <div className="space-y-5">
      {player}

      <div className="grid grid-cols-[minmax(0,2fr)_300px] gap-5">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <div className="h-6 w-1 rounded-full bg-primary" />
            Bản ghi nội dung video
          </h3>
          <div className="space-y-2.5">
            {content.segments.map(segment => (
              <div
                key={`${segment.time}-${segment.script}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-3.5 shadow-sm transition-all"
              >
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="mb-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  {segment.time}
                </span>
                <p className="text-[13px] font-medium leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                  {segment.script}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <div className="h-5 w-1 rounded-full bg-blue-500" />
            Mốc nội dung chính
          </h3>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {content.timestamps.map(timestamp => (
              <button
                key={`${timestamp.time}-${timestamp.label}`}
                className="flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/80"
                type="button"
              >
                <span className="font-mono text-[11px] font-bold text-blue-600">{timestamp.time}</span>
                <span className="truncate text-[11px] font-medium">{timestamp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
