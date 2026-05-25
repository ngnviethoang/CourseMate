'use client'

import { AlertCircle, UserCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function PendingInstructorsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Duyệt giảng viên</h1>
        <p className="text-sm text-muted-foreground">Tính năng này đang tạm khóa để đồng bộ với backend.</p>
      </div>

      <Alert>
        <AlertCircle />
        <AlertTitle>Chưa khả dụng</AlertTitle>
        <AlertDescription>
          API duyệt giảng viên chưa được backend hỗ trợ ở phiên bản hiện tại. Vui lòng sử dụng lại khi API được mở.
        </AlertDescription>
      </Alert>

      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserCheck className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">Danh sách chờ duyệt đang tạm ẩn</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Khi backend bổ sung API tương ứng, màn hình này sẽ tự động được bật lại.
        </p>
      </div>
    </div>
  )
}
