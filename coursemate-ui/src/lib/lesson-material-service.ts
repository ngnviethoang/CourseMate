import { api } from './api-client'
import type { OutlineDto, ProcessingStatusDto, UpdateOutlineRequest } from './types'

export type LessonMaterialPromptType = 'BulletSlide' | 'Reading'

export const lessonMaterialService = {
  /**
   * POST /api/lessons/{lessonId}/materials
   * Upload Word/PDF file → triggers AI processing (embedding + outline generation)
   */
  uploadMaterial: async (
    lessonId: string,
    file: File,
    promptType: LessonMaterialPromptType = 'BulletSlide'
  ): Promise<ProcessingStatusDto> => {
    const formData = new FormData()
    formData.append('request', file)
    formData.append('promptType', promptType)
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
   * PUT /api/lessons/{lessonId}/outline
   * Update the lesson outline after user modifications
   */
  updateOutline: (lessonId: string, body: UpdateOutlineRequest): Promise<OutlineDto> => {
    return api.put<OutlineDto>(`/api/lessons/${lessonId}/outline`, body)
  }
}
