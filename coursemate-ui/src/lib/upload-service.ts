import { api } from '@/lib/api-client'

export const uploadService = {
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
  }
}
