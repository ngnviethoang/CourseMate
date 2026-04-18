'use client'

import React, { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { fileService } from '@/lib/file-service'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function VideoUploadSection({ lessonId }: { lessonId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [videoUrl, setVideoUrl] = useState('')

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
      const { fileId, maxTotalTrunks } = await fileService.initVideoUpload(file.name, file.size)

      const chunkSize = Math.ceil(file.size / maxTotalTrunks)

      // Step 2: Upload Chunks
      for (let i = 1; i <= maxTotalTrunks; i++) {
        const start = (i - 1) * chunkSize
        const end = Math.min(i * chunkSize, file.size)
        const chunk = file.slice(start, end)

        await fileService.uploadVideoChunk(fileId, i, chunk)

        setProgress(Math.round((i / maxTotalTrunks) * 100))
      }

      // Step 3: Complete
      const { fileUrl } = await fileService.completeVideoUpload(fileId, maxTotalTrunks)

      setVideoUrl(fileUrl)
      setStatus('success')
      toast.success('Video uploaded successfully!')
    } catch (error) {
      console.error(error)
      setStatus('error')
      toast.error('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6 mt-6">
      <h2 className="text-lg font-semibold">Video Content</h2>

      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-muted/20">
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-sm">Upload Video</h3>
        <p className="text-xs text-muted-foreground mb-4">Select a video file to upload in chunks</p>

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full max-w-sm text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
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
              <AlertCircle className="h-4 w-4" /> Upload failed. Please try again.
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading} className="w-full gap-2">
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? 'Uploading...' : 'Start Upload'}
          </Button>
        </div>
      )}

      {status === 'success' && (
        <div className="rounded-xl border bg-green-500/10 border-green-200 p-6 text-green-700 flex flex-col items-center justify-center space-y-2 text-center max-w-sm mx-auto">
          <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-medium">Upload Complete!</h4>
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium underline hover:text-green-800 break-all mt-2"
            >
              {videoUrl}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
