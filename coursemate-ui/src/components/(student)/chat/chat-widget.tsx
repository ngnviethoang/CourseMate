'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { MessageCircle, Plus, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ChatScope, useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'

interface ChatWidgetProps {
  scope?: ChatScope
}

export function ChatWidget({ scope = {} }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const { messages, isSending, sendMessage, newConversation } = useChat(scope)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = draft
    setDraft('')
    await sendMessage(text)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  return (
    <>
      <Button
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg"
        aria-label="Mở trợ lý học tập"
      >
        <MessageCircle className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="flex-row items-center justify-between border-b">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Trợ lý học tập
              </SheetTitle>
              <SheetDescription>Hỏi đáp dựa trên nội dung khóa học</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={newConversation} aria-label="Cuộc trò chuyện mới">
              <Plus className="size-4" />
            </Button>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
            <div className="flex flex-col gap-3 py-4">
              {messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Đặt câu hỏi về bài học để được trợ giúp.
                </p>
              ) : (
                messages.map(message => <ChatBubble key={message.id} message={message} />)
              )}
            </div>
          </div>

          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={event => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                rows={1}
                className="max-h-32 min-h-10 resize-none"
                disabled={isSending}
              />
              <Button size="icon" onClick={handleSend} disabled={isSending || draft.trim().length === 0}>
                {isSending ? <Spinner className="size-4" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface ChatBubbleProps {
  message: { role: 'User' | 'Assistant'; content: string; pending?: boolean }
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'User'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
        )}
      >
        {message.pending ? <Spinner className="size-4" /> : message.content}
      </div>
    </div>
  )
}
