'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Plus, Trash2, Upload, GripVertical, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { bannerService, BannerItem } from '@/lib/banner-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif'
const MAX_MB = 5

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<string | null>(null)

  useEffect(() => {
    setBanners(bannerService.list())
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`Ảnh tối đa ${MAX_MB}MB.`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload() {
    if (!file) {
      toast.error('Vui lòng chọn ảnh.')
      return
    }
    setUploading(true)
    try {
      await bannerService.upload(file, title, link)
      setBanners(bannerService.list())
      setFile(null)
      setPreview(null)
      setTitle('')
      setLink('')
      if (fileRef.current) fileRef.current.value = ''
      toast.success('Thêm banner thành công.')
    } catch {
      toast.error('Tải ảnh lên thất bại.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(null)
    try {
      await bannerService.remove(id)
      setBanners(bannerService.list())
      toast.success('Đã xoá banner.')
    } catch {
      toast.error('Xoá banner thất bại.')
    }
  }

  function handleDragStart(id: string) {
    dragRef.current = id
  }

  function handleDragOver(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!dragRef.current || dragRef.current === targetId) return
    const ids = banners.map(b => b.id)
    const fromIdx = ids.indexOf(dragRef.current)
    const toIdx = ids.indexOf(targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const next = [...ids]
    next.splice(fromIdx, 1)
    next.splice(toIdx, 0, dragRef.current)
    bannerService.reorder(next)
    setBanners(bannerService.list())
  }

  function handleDragEnd() {
    dragRef.current = null
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý banner</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload ảnh banner hiển thị trên trang chủ. Kéo để sắp xếp thứ tự.</p>
      </div>

      {/* Upload form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thêm banner mới</CardTitle>
          <CardDescription>Ảnh tỉ lệ 16:5 sẽ hiển thị tốt nhất. Tối đa {MAX_MB}MB.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Xem trước" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8 opacity-40" />
                <p className="text-sm">Nhấn để chọn ảnh</p>
                <p className="text-xs opacity-60">JPG, PNG, WebP — tối đa {MAX_MB}MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="banner-title">Tiêu đề (tuỳ chọn)</Label>
              <Input
                id="banner-title"
                placeholder="VD: Khai giảng khoá mới"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-link">Đường dẫn khi nhấn (tuỳ chọn)</Label>
              <Input
                id="banner-link"
                placeholder="https://..."
                value={link}
                onChange={e => setLink(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleUpload} disabled={uploading || !file} className="gap-2">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {uploading ? 'Đang tải lên...' : 'Thêm banner'}
          </Button>
        </CardContent>
      </Card>

      {/* Banner list */}
      {banners.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {banners.length} banner — kéo hàng để sắp xếp thứ tự
          </p>
          {banners.map(banner => (
            <div
              key={banner.id}
              draggable
              onDragStart={() => handleDragStart(banner.id)}
              onDragOver={e => handleDragOver(e, banner.id)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-sm"
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Banner'}
                className="h-14 w-24 shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{banner.title || <span className="text-muted-foreground italic">Không có tiêu đề</span>}</p>
                {banner.link && (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 truncate text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {banner.link}
                  </a>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => setDeletingId(banner.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {banners.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-muted-foreground">
          <Upload className="h-10 w-10 opacity-25" />
          <p className="text-sm">Chưa có banner nào. Thêm banner đầu tiên bên trên.</p>
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={open => { if (!open) setDeletingId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá banner?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
