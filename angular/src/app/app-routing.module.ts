import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, permissionGuard } from '@abp/ng.core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy())
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy())
  },
  {
    path: 'setting-management',
    loadChildren: () => import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy())
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/course/course.module').then(m => m.CourseModule),
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'CourseMate.Courses' }
  },
  {
    path: 'categories',
    loadChildren: () => import('./components/category/category.module').then(m => m.CategoryModule),
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'CourseMate.Categories' }
  },
  {
    path: 'chapters',
    loadChildren: () => import('./components/chapter/chapter.module').then(m => m.ChapterModule),
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'CourseMate.Chapters' }
  },
  {
    path: 'lessons',
    loadChildren: () => import('./components/lesson/lesson.module').then(m => m.LessonModule),
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'CourseMate.Lessons' }
  },
  {
    path: 'orders',
    loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule),
    canActivate: [permissionGuard],
    data: { requiredPolicy: 'CourseMate.Orders' }
  },
  {
    path: 'reports',
    loadChildren: () => import('./components/report/report.module').then(m => m.ReportModule)
    // canActivate: [permissionGuard],
    // data: { requiredPolicy: 'CourseMate.Orders' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
