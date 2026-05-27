'use client'

import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Pagination } from './pagination'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortKey?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  heightClassName?: string
  loading?: boolean
  sorting?: string
  onSort?: (sortKey: string) => void
  onEdit?: (row: T) => void
  onDelete?: (id: string) => void
  onView?: (row: T) => void
  pagination?: {
    pageIndex: number
    pageSize: number
    totalCount: number
    onPageChange: (pageIndex: number) => void
  }
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  heightClassName,
  loading,
  sorting,
  onSort,
  onEdit,
  onDelete,
  onView,
  pagination
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete
  const colSpan = columns.length + (hasActions ? 1 : 0)
  const placeholderRowCount = pagination ? Math.max(pagination.pageSize - data.length, 0) : 0
  const loadingRowCount = pagination?.pageSize ?? Math.max(data.length, 5)

  function SortIcon({ sortKey }: { sortKey: string }) {
    if (!sorting) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
    if (sorting === sortKey) return <ArrowUp className="ml-1 h-3 w-3 text-primary" />
    if (sorting === `${sortKey}_desc`) return <ArrowDown className="ml-1 h-3 w-3 text-primary" />
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
  }

  function handleSort(sortKey: string) {
    if (!onSort) return
    if (sorting === sortKey) onSort(`${sortKey}_desc`)
    else if (sorting === `${sortKey}_desc`) onSort(sortKey)
    else onSort(sortKey)
  }

  return (
    <div
      className={cn(
        'flex h-[69vh] min-h-[420px] w-full min-w-0 flex-col overflow-hidden rounded-xl border-0 bg-card shadow-md',
        heightClassName
      )}
    >
      <div className="flex-1 min-w-0 overflow-x-auto overflow-y-auto">
        <Table className="w-full min-w-full table-auto">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map(col => (
                <TableHead
                  key={String(col.key)}
                  className={`px-4 py-3 font-medium text-muted-foreground ${
                    col.sortKey && onSort ? 'cursor-pointer select-none hover:text-foreground' : ''
                  }`}
                  onClick={() => col.sortKey && handleSort(col.sortKey)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortKey && onSort && <SortIcon sortKey={col.sortKey} />}
                  </span>
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-24 px-4 py-3 text-right font-medium text-muted-foreground">Thao tác</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60 [&_tr]:border-b-0">
            {loading ? (
              Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                <TableRow key={`loading-row-${rowIndex}`} aria-busy="true">
                  {columns.map(col => (
                    <TableCell key={`loading-cell-${rowIndex}-${String(col.key)}`} className="px-4 py-3 text-sm">
                      <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="px-4 py-3 text-right">
                      <div className="ml-auto h-4 w-14 animate-pulse rounded bg-muted/70" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="px-4 py-16 text-center text-sm text-muted-foreground">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data.map(row => (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-muted/30 transition-colors ${onView ? 'cursor-pointer' : ''}`}
                    onClick={() => onView?.(row)}
                  >
                    {columns.map(col => (
                      <TableCell key={String(col.key)} className="px-4 py-3 text-sm">
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={e => {
                                e.stopPropagation()
                                onEdit(row)
                              }}
                              className="h-7 w-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={e => {
                                e.stopPropagation()
                                onDelete(row.id)
                              }}
                              className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

                {Array.from({ length: placeholderRowCount }).map((_, rowIndex) => (
                  <TableRow key={`placeholder-row-${rowIndex}`} aria-hidden="true">
                    {columns.map(col => (
                      <TableCell key={`placeholder-cell-${rowIndex}-${String(col.key)}`} className="px-4 py-3 text-sm">
                        <span className="invisible">.</span>
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="px-4 py-3 text-right">
                        <span className="invisible">.</span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="sticky bottom-0 z-10 border-t border-border/60 bg-card">
          <Pagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  )
}
