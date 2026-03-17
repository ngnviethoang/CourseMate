'use client'

import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortKey?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  sorting?: string
  onSort?: (sortKey: string) => void
  onEdit?: (row: T) => void
  onDelete?: (id: string) => void
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  sorting,
  onSort,
  onEdit,
  onDelete
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete

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

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map(col => (
              <TableHead
                key={String(col.key)}
                className={col.sortKey && onSort ? 'cursor-pointer select-none hover:text-primary' : ''}
                onClick={() => col.sortKey && handleSort(col.sortKey)}
              >
                <span className="inline-flex items-center font-semibold text-xs uppercase tracking-wide">
                  {col.header}
                  {col.sortKey && onSort && <SortIcon sortKey={col.sortKey} />}
                </span>
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="w-24 text-right">
                <span className="font-semibold text-xs uppercase tracking-wide">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="h-24 text-center text-muted-foreground text-sm"
              >
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            data.map(row => (
              <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                {columns.map(col => (
                  <TableCell key={String(col.key)} className="text-sm">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
