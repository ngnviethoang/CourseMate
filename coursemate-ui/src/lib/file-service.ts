import { api } from '@/lib/api-client'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '')

interface FileUploadResponse {
  fileId: string
  fileUrl?: string
}

export const fileService = {
  async uploadFile(file: File | Blob, fileName?: string) {
    const formData = new FormData()
    const normalizedFileName = file instanceof File ? file.name : (fileName ?? 'upload.bin')
    formData.append('request', file, normalizedFileName)
    return api.post<FileUploadResponse>('/api/files', formData)
  },

  async deleteFile(fileId: string) {
    return api.delete<void>(`/api/files/${fileId}`)
  },

  getDownloadUrl(fileId: string) {
    const path = `/api/files/${fileId}/download`
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path
  },

  async initVideoUpload(fileName: string, fileSize: number) {
    return api.post<{ fileId: string; maxTotalTrunks: number }>('/api/files/videos/init', { fileName, fileSize })
  },

  async uploadVideoChunk(fileId: string, chunkIndex: number, file: Blob) {
    const formData = new FormData()
    formData.append('file', file, 'chunk.mp4')

    return api.post<void>(`/api/files/videos/${fileId}/chunks/${chunkIndex}`, formData)
  },

  async completeVideoUpload(fileId: string, totalChunks: number, lessonId?: string) {
    return api.post<{ fileUrl: string }>('/api/files/videos/completed', { fileId, totalChunks, lessonId })
  },

  async getVideoUploadStatus(fileId: string) {
    return api.get<unknown>(`/api/files/videos/${fileId}`)
  },

  async deleteVideo(fileId: string) {
    return fileService.deleteFile(fileId)
  },

  // Deprecated wrappers kept for compatibility with existing callers.
  async uploadImage(file: File) {
    return fileService.uploadFile(file)
  },

  async deleteImage(fileId: string) {
    return fileService.deleteFile(fileId)
  },

  async uploadDocument(file: File) {
    return fileService.uploadFile(file)
  }
}
