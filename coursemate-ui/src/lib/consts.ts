export enum Roles {
  Admin = 'Admin',
  Student = 'Student',
  Instructor = 'Instructor'
}

export const RoleLabels: Record<Roles, string> = {
  [Roles.Admin]: 'Quản trị viên',
  [Roles.Student]: 'Học sinh',
  [Roles.Instructor]: 'Giảng viên'
}
