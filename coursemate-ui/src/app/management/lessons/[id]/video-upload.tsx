'use client'

import React, { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { createPlayer } from '@videojs/react'
import { MinimalVideoSkin, Video as VideoJsVideo, videoFeatures } from '@videojs/react/video'
import { UploadCloud, AlertCircle, Loader2, Video, Edit } from 'lucide-react'
import { toast } from 'sonner'
import { getAccessToken } from '@/lib/auth-token.util'
import { fileService } from '@/lib/file-service'
import { lessonService } from '@/lib/course-service'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const Player = createPlayer({ features: videoFeatures })
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

type VideoProcessedNotification = {
  fileId?: string
  FileId?: string
  fileUrl?: string
  FileUrl?: string
  success?: boolean
  Success?: boolean
  message?: string
  Message?: string
}

export function VideoUploadSection({ lessonId, initialVideoUrl }: { lessonId: string; initialVideoUrl?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl ?? '')
  const [isEditing, setIsEditing] = useState(!initialVideoUrl)
  const [autoPlayVideo, setAutoPlayVideo] = useState(false)
  const currentUploadIdRef = useRef<string | null>(null)

  const hasVideoTrack = async (targetFile: File): Promise<boolean> => {
    const objectUrl = URL.createObjectURL(targetFile)
    try {
      const result = await new Promise<boolean>(resolve => {
        const preview = document.createElement('video')
        preview.preload = 'metadata'
        preview.muted = true
        preview.src = objectUrl

        const timeout = window.setTimeout(() => resolve(false), 5000)
        preview.onloadedmetadata = () => {
          window.clearTimeout(timeout)
          resolve(preview.videoWidth > 0 && preview.videoHeight > 0)
        }
        preview.onerror = () => {
          window.clearTimeout(timeout)
          resolve(false)
        }
      })
      return result
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nextFile = e.target.files[0]
      const isMp4 = nextFile.name.toLowerCase().endsWith('.mp4')
      if (!isMp4) {
        toast.error('Chỉ hỗ trợ định dạng .mp4 để đảm bảo phát hình ảnh ổn định.')
        e.target.value = ''
        return
      }

      setFile(nextFile)
      setStatus('idle')
      setProgress(0)
      setAutoPlayVideo(false)
    }
  }

  useEffect(() => {
    if (!API_BASE_URL) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notification`, {
        accessTokenFactory: () => getAccessToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('VideoProcessed', (notification: VideoProcessedNotification) => {
      const fileId = notification.fileId ?? notification.FileId
      if (!fileId || !currentUploadIdRef.current || fileId.toLowerCase() !== currentUploadIdRef.current.toLowerCase())
        return

      const success = notification.success ?? notification.Success ?? false
      const message = notification.message ?? notification.Message

      if (!success) {
        setStatus('error')
        setUploading(false)
        currentUploadIdRef.current = null
        toast.error(message || 'Ghép video thất bại. Vui lòng thử lại.')
        return
      }

      currentUploadIdRef.current = null

      void (async () => {
        let nextVideoUrl = notification.fileUrl ?? notification.FileUrl ?? ''
        if (!nextVideoUrl) {
          const detail = await lessonService.getDetail(lessonId).catch(() => null)
          nextVideoUrl = detail?.videoUrl ?? ''
        }
        setVideoUrl(nextVideoUrl)
        setStatus('success')
        setUploading(false)
        setIsEditing(false)
        setFile(null)
        setProgress(100)
        setAutoPlayVideo(true)
        toast.success(message || 'Video đã sẵn sàng.')
      })()
    })

    void connection.start().catch(() => {})

    return () => {
      connection.off('VideoProcessed')
      void connection.stop().catch(() => {})
    }
  }, [lessonId])

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('uploading')
    setProgress(0)

    try {
      const fileContainsVideo = await hasVideoTrack(file)
      if (!fileContainsVideo) {
        setStatus('error')
        setUploading(false)
        toast.error('Video không có track hình ảnh hợp lệ hoặc codec không được trình duyệt hỗ trợ.')
        return
      }

      // Step 1: Init
      const { fileId } = await fileService.initVideoUpload(file.name, file.size)
      currentUploadIdRef.current = fileId

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
      await fileService.completeVideoUpload(fileId, maxTotalTrunks, lessonId)
      setStatus('processing')
      setUploading(false)
      toast.info('Video đã tải xong. Hệ thống đang ghép file và sẽ tự cập nhật khi hoàn tất.')
    } catch (error) {
      console.error(error)
      setStatus('error')
      currentUploadIdRef.current = null
      setUploading(false)
      toast.error('Không thể tải video lên. Vui lòng thử lại.')
    }
  }

  const isYoutubeUrl = (url: string) => {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

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
        <div className="space-y-4">
          {status === 'processing' ? (
            <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 p-5">
              <div className="relative shrink-0">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-blue-500" />
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Đang xử lý video</p>
                <p className="text-xs text-blue-700/70 dark:text-blue-400/70">
                  Hệ thống đang ghép file và sẽ tự động cập nhật khi hoàn tất
                </p>
              </div>
            </div>
          ) : (
            <label
              className={[
                'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-150',
                status === 'error'
                  ? 'border-destructive/50 bg-destructive/5'
                  : file
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border hover:border-primary/40 hover:bg-muted/30',
                uploading ? 'pointer-events-none opacity-60' : ''
              ].join(' ')}
            >
              <input
                type="file"
                accept=".mp4,video/mp4"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {file ? (
                <>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Video className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Nhấn để đổi file
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-muted">
                    <UploadCloud className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">Chọn file video</p>
                    <p className="text-xs text-muted-foreground">Chỉ hỗ trợ định dạng .mp4</p>
                  </div>
                </>
              )}
            </label>
          )}

          {status === 'uploading' && (
            <div className="space-y-2 px-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Đang tải lên...</span>
                <span className="font-medium tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Tải lên thất bại. Vui lòng thử lại.
            </div>
          )}

          {file && status !== 'processing' && (
            <Button onClick={handleUpload} disabled={uploading} className="w-full gap-2">
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {uploading ? 'Đang tải lên...' : 'Bắt đầu tải lên'}
            </Button>
          )}
        </div>
      ) : (
        <>
          {videoUrl ? (
            <div className="space-y-3">
              <div className="relative w-[951px] h-[535px] max-w-full mx-auto overflow-hidden rounded-xl bg-transparent">
                {isYoutubeUrl(videoUrl) ? (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <Player.Provider key={videoUrl}>
                    <MinimalVideoSkin className="w-full h-full rounded-xl">
                      <VideoJsVideo
                        src={videoUrl}
                        autoPlay={autoPlayVideo}
                        playsInline
                        controlsList="nodownload noremoteplayback"
                        className="w-full h-full object-contain"
                      />
                    </MinimalVideoSkin>
                  </Player.Provider>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Video đã liên kết với bài học và sẵn sàng phát.</p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">Chưa có video nào được tải lên.</p>
          )}
        </>
      )}
    </div>
  )
}
