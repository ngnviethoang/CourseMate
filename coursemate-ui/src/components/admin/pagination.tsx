'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  pageIndex: number
  pageSize: number
  totalCount: number
  onPageChange: (pageIndex: number) => void
}

export function Pagination({ pageIndex, pageSize, totalCount, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  const pages: (number | string)[] = []

  // Logic to show a specific range of page numbers
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    if (pageIndex > 3) pages.push('...')

    const start = Math.max(1, pageIndex - 1)
    const end = Math.min(totalPages - 2, pageIndex + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    if (pageIndex < totalPages - 4) pages.push('...')
    pages.push(totalPages - 1)
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Hiển thị <span className="font-medium">{pageIndex * pageSize + 1}</span> đến{' '}
        <span className="font-medium">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> trên tổng{' '}
        <span className="font-medium">{totalCount}</span> kết quả
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) => (
          <div key={i}>
            {typeof p === 'number' ? (
              <Button
                variant={p === pageIndex ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(p)}
              >
                {p + 1}
              </Button>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={pageIndex >= totalPages - 1}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
