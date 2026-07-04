'use client'

import { useCallback, useState } from 'react'
import {
  chatService,
  ChatConversationDto,
  ChatMessageDto,
  ChatSourceDto,
  SendChatMessageRequest
} from '@/lib/chat-service'

export interface ChatScope {
  courseId?: string
  lessonId?: string
}

interface LocalMessage {
  id: string
  role: 'User' | 'Assistant'
  content: string
  sources?: ChatSourceDto[]
  pending?: boolean
}

interface UseChatResult {
  messages: LocalMessage[]
  conversations: ChatConversationDto[]
  conversationId?: string
  isSending: boolean
  sendMessage: (text: string) => Promise<void>
  loadConversations: () => Promise<void>
  openConversation: (id: string) => Promise<void>
  newConversation: () => void
  deleteConversation: (id: string) => Promise<void>
}

function toLocal(message: ChatMessageDto): LocalMessage {
  return { id: message.id, role: message.role, content: message.content }
}

export function useChat(scope: ChatScope = {}): UseChatResult {
  const [messages, setMessages] = useState<LocalMessage[]>([])
  const [conversations, setConversations] = useState<ChatConversationDto[]>([])
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [isSending, setIsSending] = useState(false)

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isSending) return
      const optimisticId = `local-${Date.now()}`
      setMessages(prev => [
        ...prev,
        { id: optimisticId, role: 'User', content: trimmed },
        { id: `${optimisticId}-pending`, role: 'Assistant', content: '', pending: true }
      ])
      setIsSending(true)
      try {
        const request: SendChatMessageRequest = {
          conversationId,
          courseId: scope.courseId,
          lessonId: scope.lessonId,
          text: trimmed
        }
        const answer = await chatService.sendMessage(request)
        setConversationId(answer.conversationId)
        setMessages(prev =>
          prev.map(message =>
            message.id === `${optimisticId}-pending`
              ? { id: answer.messageId, role: 'Assistant', content: answer.answer, sources: answer.sources }
              : message
          )
        )
      } catch {
        setMessages(prev => prev.filter(message => message.id !== `${optimisticId}-pending`))
      } finally {
        setIsSending(false)
      }
    },
    [conversationId, isSending, scope.courseId, scope.lessonId]
  )

  const loadConversations = useCallback(async () => {
    const result = await chatService.getConversations()
    setConversations(result.items)
  }, [])

  const openConversation = useCallback(async (id: string) => {
    const result = await chatService.getMessages(id)
    setConversationId(id)
    setMessages(result.items.map(toLocal))
  }, [])

  const newConversation = useCallback(() => {
    setConversationId(undefined)
    setMessages([])
  }, [])

  const deleteConversation = useCallback(
    async (id: string) => {
      await chatService.deleteConversation(id)
      setConversations(prev => prev.filter(conversation => conversation.id !== id))
      if (conversationId === id) {
        setConversationId(undefined)
        setMessages([])
      }
    },
    [conversationId]
  )

  return {
    messages,
    conversations,
    conversationId,
    isSending,
    sendMessage,
    loadConversations,
    openConversation,
    newConversation,
    deleteConversation
  }
}
