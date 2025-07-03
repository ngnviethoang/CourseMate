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
      path: '/',
      name: '::Menu:Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application
    },
    {
      path: '/books',
      name: '::Menu:Books',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Books'
    },
    {
      path: '/categories',
      name: '::Menu:Categories',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Categories'
    },
    {
      path: '/courses',
      name: '::Menu:Courses',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Courses'
    },
    {
      path: '/chapters',
      name: '::Menu:Chapters',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Chapters'
    },
    {
      path: '/lessons',
      name: '::Menu:Lessons',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Lessons'
    },
    {
      path: '/instructions',
      name: '::Menu:Instructions',
      iconClass: 'fas fa-user',
      layout: eLayoutType.application
    },
    {
      path: '/students',
      name: '::Menu:Students',
      iconClass: 'fas fa-graduation-cap',
      layout: eLayoutType.application
    },
    {
      path: '/orders',
      name: '::Menu:Orders',
      iconClass: 'fas fa-shopping-cart',
      layout: eLayoutType.application
    },
    {
      path: '/paymentRequests',
      name: '::Menu:PaymentRequest',
      iconClass: 'fas fa-credit-card',
      layout: eLayoutType.application
    }
  ]);
}
