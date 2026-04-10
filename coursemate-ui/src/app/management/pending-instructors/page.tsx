'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/lib/admin-service'
import type { UserDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

export default function PendingInstructorsPage() {
  const [items, setItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('')
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.listPendingInstructors({ filter, pageSize: 10, sorting })
      setItems(res.items)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  async function handleApprove() {
    if (!approveId) return
    try {
      await userService.approveInstructor(approveId)
      toast.success('Instructor approved.')
      load()
    } catch {
      toast.error('Failed to approve instructor.')
    } finally {
      setApproveId(null)
    }
  }

  async function handleReject() {
    if (!rejectId) return
    try {
      await userService.rejectInstructor(rejectId)
      toast.success('Instructor application rejected.')
      load()
    } catch {
      toast.error('Failed to reject instructor application.')
    } finally {
      setRejectId(null)
    }
  }

  const columns: Column<UserDto>[] = [
    { key: 'userName', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Phone' },
    {
      key: 'id',
      header: 'Actions',
      render: row => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => setApproveId(row.id)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setRejectId(row.id)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Instructor Approvals</h1>
          <p className="text-sm text-muted-foreground">Review users pending instructor access</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search pending instructors…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={items} loading={loading} sorting={sorting} onSort={setSorting} />

      <AlertDialog open={!!approveId} onOpenChange={open => !open && setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Instructor?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will be granted the Instructor role and allowed to create courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleApprove}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!rejectId} onOpenChange={open => !open && setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Instructor Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will remain a standard Student and will not be granted Instructor privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleReject}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
