import { api } from './api-client'

export type ChatRole = 'User' | 'Assistant'

export interface ChatSourceDto {
  fileChunkId: string
  fileEntryId: string
  shortText: string
}

export interface ChatAnswerDto {
  conversationId: string
  messageId: string
  answer: string
  sources: ChatSourceDto[]
}

export interface ChatMessageDto {
  id: string
  conversationId: string
  role: ChatRole
  content: string
  createdAt: string
}

export interface ChatConversationDto {
  id: string
  title: string
  courseId?: string
  lessonId?: string
  createdAt: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
}

export interface SendChatMessageRequest {
  conversationId?: string
  courseId?: string
  lessonId?: string
  text: string
}

export const chatService = {
  sendMessage: (request: SendChatMessageRequest) => api.post<ChatAnswerDto>('/api/chat/messages', request),
  getConversations: (pageIndex = 1, pageSize = 25) =>
    api.get<PagedResult<ChatConversationDto>>(`/api/chat/conversations?PageIndex=${pageIndex}&PageSize=${pageSize}`),
  getMessages: (conversationId: string, pageIndex = 1, pageSize = 100) =>
    api.get<PagedResult<ChatMessageDto>>(
      `/api/chat/conversations/${conversationId}/messages?PageIndex=${pageIndex}&PageSize=${pageSize}`
    ),
  deleteConversation: (conversationId: string) => api.delete<void>(`/api/chat/conversations/${conversationId}`)
}
