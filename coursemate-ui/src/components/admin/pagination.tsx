'use client'

import { cn } from '@/lib/utils'
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

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

  function handlePageChange(nextPageIndex: number) {
    if (nextPageIndex < 0 || nextPageIndex >= totalPages || nextPageIndex === pageIndex) return
    onPageChange(nextPageIndex)
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
        Hiển thị <span className="font-medium">{pageIndex * pageSize + 1}</span> đến{' '}
        <span className="font-medium">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> trên tổng{' '}
        <span className="font-medium">{totalCount}</span> kết quả
      </div>
      <UiPagination className="mx-0 min-w-[320px] justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Trước"
              className={cn(pageIndex === 0 && 'pointer-events-none opacity-50')}
              onClick={e => {
                e.preventDefault()
                handlePageChange(pageIndex - 1)
              }}
            />
          </PaginationItem>

          {pages.map((p, i) => (
            <PaginationItem key={`${p}-${i}`}>
              {typeof p === 'number' ? (
                <PaginationLink
                  href="#"
                  isActive={p === pageIndex}
                  onClick={e => {
                    e.preventDefault()
                    handlePageChange(p)
                  }}
                >
                  {p + 1}
                </PaginationLink>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              text="Sau"
              className={cn(pageIndex >= totalPages - 1 && 'pointer-events-none opacity-50')}
              onClick={e => {
                e.preventDefault()
                handlePageChange(pageIndex + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </UiPagination>
    </div>
  )
}
