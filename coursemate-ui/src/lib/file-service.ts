import { api } from '@/lib/api-client'

export const fileService = {
  async initVideoUpload(fileName: string, fileSize: number) {
    return api.post<{ fileId: string; maxTotalTrunks: number }>('/api/files/videos/init', { fileName, fileSize })
  },

  async uploadVideoChunk(fileId: string, chunkIndex: number, file: Blob) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<void>(`/api/files/videos/${fileId}/chunks/${chunkIndex}`, formData)
  },

  async completeVideoUpload(fileId: string, totalChunks: number) {
    return api.post<{ fileUrl: string }>('/api/files/videos/completed', { fileId, totalChunks })
  },

  async getVideoUploadStatus(fileId: string) {
    return api.get<unknown>(`/api/files/videos/${fileId}`)
  },

  async deleteVideo(fileId: string) {
    return api.delete<void>(`/api/files/videos/${fileId}`)
  },

  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('request', file)
    return api.post<unknown>('/api/files/images', formData)
  },

  async deleteImage(fileId: string) {
    return api.delete<void>(`/api/files/images/${fileId}`)
  }
}
