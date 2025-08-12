import { RoutesService, eLayoutType } from '@abp/ng.core';
import { provideAppInitializer, inject } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  })
];

function configureRoutes() {
  const routes = inject(RoutesService);
  routes.add([
    {
      name: '::Menu:Dashboard',
      iconClass: 'fas fa-tachometer-alt',
      order: 1,
      // requiredPolicy: 'CourseMate.Courses',
      layout: eLayoutType.application
    },
    {
      path: '/',
      name: '::Menu:Overview',
      iconClass: 'fas fa-chart-line',
      layout: eLayoutType.application,
      parentName: '::Menu:Dashboard'
    },
    {
      path: '/reports',
      name: '::Menu:Reports',
      iconClass: 'fas fa-file-alt',
      layout: eLayoutType.application,
      parentName: '::Menu:Dashboard'
    },
    {
      name: '::Menu:SystemManagement',
      iconClass: 'fas fa-cog',
      layout: eLayoutType.application
    },
    {
      path: '/news',
      name: '::Menu:News',
      iconClass: 'fas fa-newspaper',
      layout: eLayoutType.application,
      parentName: '::Menu:SystemManagement'
    },
    {
      path: '/banners',
      name: '::Menu:Banners',
      iconClass: 'fas fa-image',
      layout: eLayoutType.application,
      parentName: '::Menu:SystemManagement'
    },
    {
      path: '/files',
      name: '::Menu:Files',
      iconClass: 'fas fa-folder-open',
      layout: eLayoutType.application,
      parentName: '::Menu:SystemManagement'
    },
    {
      name: '::Menu:CourseManagement',
      iconClass: 'fas fa-graduation-cap',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Courses'
    },
    {
      path: '/categories',
      name: '::Menu:Categories',
      iconClass: 'fas fa-list',
      layout: eLayoutType.application,
      parentName: '::Menu:CourseManagement'
    },
    {
      path: '/courses',
      name: '::Menu:Courses',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      parentName: '::Menu:CourseManagement'
    },
    {
      path: '/instructors',
      name: '::Menu:Instructors',
      iconClass: 'fas fa-chalkboard-teacher',
      layout: eLayoutType.application,
      parentName: '::Menu:CourseManagement'
    },
    {
      path: '/students',
      name: '::Menu:Students',
      iconClass: 'fas fa-user-graduate',
      layout: eLayoutType.application,
      parentName: '::Menu:CourseManagement'
    },
    {
      name: '::Menu:PaymentManagement',
      iconClass: 'fas fa-shopping-cart',
      layout: eLayoutType.application
    },
    {
      path: '/orders',
      name: '::Menu:Orders',
      iconClass: 'fas fa-receipt',
      layout: eLayoutType.application,
      parentName: '::Menu:PaymentManagement'
    },
    {
      path: '/payment-requests',
      name: '::Menu:PaymentRequests',
      iconClass: 'fas fa-money-check-alt',
      layout: eLayoutType.application,
      parentName: '::Menu:PaymentManagement'
    }
  ]);
}

