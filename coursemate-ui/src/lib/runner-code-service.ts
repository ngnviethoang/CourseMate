import { LanguageDto, RunCodeRequest, RunCodeResponse } from './types'
import { api } from './api-client'

export const runnerCodeService = {
  /**
   * GET danh sách ngôn ngữ từ Code Runner (Port 7071)
   */
  getLanguages: async (): Promise<LanguageDto[]> => {
    return api.get<LanguageDto[]>('/api/code-runner')
  },

  /**
   * POST và chạy code qua Code Runner (Port 7071)
   */
  run: async (request: RunCodeRequest): Promise<RunCodeResponse> => {
    return api.post<RunCodeResponse>('/api/code-runner', request)
  }
}
