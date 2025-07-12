import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, permissionGuard } from '@abp/ng.core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
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
    loadChildren: () => import('./components/category/category.module').then(m => m.CategoryModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Categories'
    }
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/course/course.module').then(m => m.CourseModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Courses'
    }
  },
  {
    path: 'chapters',
    loadChildren: () => import('./components/chapter/chapter.module').then(m => m.ChapterModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Chapters'
    }
  },
  {
    path: 'lessons',
    loadChildren: () => import('./components/lesson/lesson.module').then(m => m.LessonModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Lessons'
    }
  },
  {
    path: 'orders',
    loadChildren: () => import('./components/order/order.module').then(m => m.OrderModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Orders'
    }
  },
  {
    path: 'payment-requests',
    loadChildren: () => import('./components/payment-request/payment-request.module').then(m => m.PaymentRequestModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.PaymentRequests'
    }
  },
  {
    path: 'students',
    loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule),
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'CourseMate.Students'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
