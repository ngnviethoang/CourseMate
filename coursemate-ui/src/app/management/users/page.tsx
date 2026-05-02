'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/lib/user-service'
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Label } from '@/components/ui/label'

const columns: Column<UserDto>[] = [
  { key: 'userName', header: 'Username' },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Phone' }
]

const emptyCreate: CreateUserRequest = { userName: '', email: '', phoneNumber: '', password: '', role: 'Student' }
const emptyUpdate: UpdateUserRequest = { userName: '', email: '', phoneNumber: '' }

export default function UsersPage() {
  const [items, setItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<UserDto | null>(null)
  const [createForm, setCreateForm] = useState<CreateUserRequest>(emptyCreate)
  const [updateForm, setUpdateForm] = useState<UpdateUserRequest>(emptyUpdate)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({ filter, pageSize: 10, sorting })
      setItems(res.items)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function openCreate() {
    setEditing(null)
    setCreateForm(emptyCreate)
    setDialogOpen(true)
  }
  function openEdit(row: UserDto) {
    setEditing(row)
    setUpdateForm({ userName: row.userName ?? '', email: row.email ?? '', phoneNumber: row.phoneNumber ?? '' })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await userService.update(editing.id, updateForm)
        toast.success('User updated.')
      } else {
        await userService.create(createForm)
        toast.success('User created.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await userService.delete(deleteId)
    toast.success('User deleted.')
    setDeleteId(null)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage system users</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New User
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search users…" value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        sorting={sorting}
        onSort={setSorting}
        onEdit={openEdit}
        onDelete={setDeleteId}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                value={editing ? updateForm.userName : createForm.userName}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, userName: e.target.value })
                    : setCreateForm({ ...createForm, userName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={editing ? updateForm.email : createForm.email}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, email: e.target.value })
                    : setCreateForm({ ...createForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={editing ? updateForm.phoneNumber : createForm.phoneNumber}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, phoneNumber: e.target.value })
                    : setCreateForm({ ...createForm, phoneNumber: e.target.value })
                }
              />
            </div>
            {!editing && (
              <>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select
                    value={createForm.role ?? 'Student'}
                    onValueChange={val => setCreateForm({ ...createForm, role: val || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Instructor">Instructor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
