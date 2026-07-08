import { api } from './api-client'
import type { OutlineDto, ProcessingStatusDto, UpdateOutlineRequest } from './types'

export type LessonMaterialPromptType = 'BulletSlide' | 'Reading'

export const lessonMaterialService = {
  /**
   * POST /api/lessons/{lessonId}/materials/bullet-slide
   * POST /api/lessons/{lessonId}/materials/reading-outline
   * Upload Word/PDF file and trigger AI processing for the selected prompt type.
   */
  uploadMaterial: async (
    lessonId: string,
    file: File,
    promptType: LessonMaterialPromptType = 'BulletSlide'
  ): Promise<ProcessingStatusDto> => {
    const formData = new FormData()
    formData.append('request', file)
    const routeSegment = promptType === 'Reading' ? 'reading-outline' : 'bullet-slide'
    return api.post<ProcessingStatusDto>(`/api/lessons/${lessonId}/materials/${routeSegment}`, formData)
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
