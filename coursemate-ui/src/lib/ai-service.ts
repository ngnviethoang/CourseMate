import { api } from './api-client'

export const aiService = {
  createLessonMaterial: (lessonId: string, file: File) => {
    const formData = new FormData()
    formData.append('request', file)
    return api.post<any>(`/api/ai/${lessonId}/materials`, formData)
  },
  getOutline: (lessonId: string) => api.get<any>(`/api/ai/${lessonId}/outline`),
  updateOutline: (lessonId: string, command: any) => api.put<any>(`/api/ai/${lessonId}/outline`, command),
  regenerateOutline: (lessonId: string) => api.post<any>(`/api/ai/${lessonId}/outline/regenerate`),
  generateSlide: (lessonId: string) => api.post<any>(`/api/ai/${lessonId}/generate-slide`),
  getSlide: (lessonId: string) => api.get<any>(`/api/ai/${lessonId}/slide`),
  getStatus: (lessonId: string) => api.get<any>(`/api/ai/${lessonId}/status`)
}
