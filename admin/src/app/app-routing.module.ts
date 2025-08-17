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
    path: 'categories',
    loadChildren: () => import('./components/category/category.module').then(m => m.CategoryModule)
    /*  canActivate: [permissionGuard],
      data: { requiredPolicy: 'CourseMate.Categories' }*/
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/course/course.module').then(m => m.CourseModule)
  },
  {
    path: 'courses/:courseId/chapters',
    loadChildren: () => import('./components/chapter/chapter.module').then(m => m.ChapterModule)
  },
  {
    path: 'chapters/:chapterId/lessons',
    loadChildren: () => import('./components/lesson/lesson.module').then(m => m.LessonModule)
  },
  {
    path: 'instructors',
    loadChildren: () => import('./components/instructor/instructor.module').then(m => m.InstructorModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./components/report/report.module').then(m => m.ReportModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
