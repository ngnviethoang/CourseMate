'use client'

import React, { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Video, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { fileService } from '@/lib/file-service'
import { lessonService } from '@/lib/course-service'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function VideoUploadSection({ lessonId, initialVideoUrl }: { lessonId: string; initialVideoUrl?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl ?? '')
  const [isEditing, setIsEditing] = useState(!initialVideoUrl)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setStatus('idle')
      setProgress(0)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('uploading')
    setProgress(0)

    try {
      // Step 1: Init
      const { fileId } = await fileService.initVideoUpload(file.name, file.size)

      // Calculate chunks in frontend (e.g., 5MB per chunk)
      const CHUNK_SIZE = 5 * 1024 * 1024
      const maxTotalTrunks = Math.ceil(file.size / CHUNK_SIZE)

      // Step 2: Upload Chunks
      for (let i = 1; i <= maxTotalTrunks; i++) {
        const start = (i - 1) * CHUNK_SIZE
        const end = Math.min(i * CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        await fileService.uploadVideoChunk(fileId, i, chunk)

        setProgress(Math.round((i / maxTotalTrunks) * 100))
      }

      // Step 3: Complete
      const { fileUrl } = await fileService.completeVideoUpload(fileId, maxTotalTrunks)

      // Step 4: Link video to lesson
      await lessonService.upsertVideo(lessonId, { videoUrl: fileUrl })

      setVideoUrl(fileUrl)
      setStatus('success')
      setIsEditing(false)
      toast.success('Tải video lên và lưu thành công!')
    } catch (error) {
      console.error(error)
      setStatus('error')
      toast.error('Không thể tải video lên. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-md border-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" /> Nội dung video
        </h2>
        {videoUrl && !uploading && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="gap-2">
            {isEditing ? (
              'Hủy'
            ) : (
              <>
                <Edit className="h-3.5 w-3.5" /> Đổi video
              </>
            )}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center -2 -dashed rounded-xl p-8 bg-muted/20">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-sm">Tải video lên</h3>
            <p className="text-xs text-muted-foreground mb-4">Chọn tệp video để tải lên theo từng phần</p>

            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full max-w-sm text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              disabled={uploading}
            />
          </div>

          {file && status !== 'success' && (
            <div className="space-y-4 max-w-sm mx-auto pb-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                <span className="text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              {status === 'uploading' && (
                <div className="space-y-1.5">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-right text-muted-foreground">{progress}%</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-sm text-destructive justify-center">
                  <AlertCircle className="h-4 w-4" /> Tải lên thất bại. Vui lòng thử lại.
                </div>
              )}

              <Button onClick={handleUpload} disabled={uploading} className="w-full gap-2">
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? 'Đang tải lên...' : 'Bắt đầu tải lên'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl bg-muted/20 rounded-lg p-5 border-0 -dashed bg-muted/30 shadow-inner space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nguồn video</p>
          {videoUrl ? (
            <div className="flex items-center gap-4">
              <div className="h-16 w-28 bg-zinc-950 rounded flex items-center justify-center shrink-0 -zinc-800">
                <Video className="h-6 w-6 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="relative aspect-video w-full max-w-sm bg-zinc-950 rounded-lg overflow-hidden -zinc-800 group shadow-lg">
                  <video src={videoUrl} className="w-full h-full object-contain" controls={false} />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-xs font-bold transform translate-y-2 group-hover:translate-y-0 transition-all"
                    >
                      Xem trước video
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[250px] bg-muted px-2 py-1 rounded">
                    {videoUrl}
                  </p>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    SẴN SÀNG
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">Chưa có video nào được tải lên.</p>
          )}
        </div>
      )}
    </div>
  )
}
