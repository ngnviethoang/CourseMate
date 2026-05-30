import { api } from './api-client'
import type { LessonOutlineStatusDto, OutlineDto, ProcessingStatusDto, UpdateOutlineRequest } from './types'

export const lessonMaterialService = {
  /**
   * POST /api/lessons/{lessonId}/materials
   * Upload Word/PDF file → triggers AI processing (embedding + outline generation)
   */
  uploadMaterial: async (lessonId: string, file: File): Promise<ProcessingStatusDto> => {
    const formData = new FormData()
    formData.append('request', file)
    return api.post<ProcessingStatusDto>(`/api/lessons/${lessonId}/materials`, formData)
  },

  /**
   * GET /api/lessons/{lessonId}/outline
   * Retrieve the AI-generated outline for the lesson
   */
  getOutline: (lessonId: string): Promise<OutlineDto | null> => {
    return api.get<OutlineDto>(`/api/lessons/${lessonId}/outline`)
  },

  /**
   * GET /api/lessons/{lessonId}/outline-status
   * Retrieve processing status so client can poll cheaply and fetch outline only when ready
   */
  getOutlineStatus: (lessonId: string): Promise<LessonOutlineStatusDto> => {
    return api.get<LessonOutlineStatusDto>(`/api/lessons/${lessonId}/outline-status`)
  },

  /**
   * PUT /api/lessons/{lessonId}/outline
   * Update the lesson outline after user modifications
   */
  updateOutline: (lessonId: string, body: UpdateOutlineRequest): Promise<OutlineDto> => {
    return api.put<OutlineDto>(`/api/lessons/${lessonId}/outline`, body)
  }
}
