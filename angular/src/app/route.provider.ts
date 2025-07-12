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
      path: '/categories',
      name: '::Menu:Categories',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Categories'
    },
    {
      path: '/courses',
      name: '::Menu:Courses',
      iconClass: 'fas fa-graduation-cap',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Courses'
    },
    {
      path: '/students',
      name: '::Menu:Students',
      iconClass: 'fas fa-users',
      requiredPolicy: 'CourseMate.Students',
      layout: eLayoutType.application
    },
    {
      path: '/orders',
      name: '::Menu:Orders',
      iconClass: 'fas fa-shopping-cart',
      requiredPolicy: 'CourseMate.Orders',
      layout: eLayoutType.application
    },
    {
      path: '/payment-requests',
      name: '::Menu:PaymentRequest',
      iconClass: 'fas fa-credit-card',
      requiredPolicy: 'CourseMate.PaymentRequests',
      layout: eLayoutType.application
    }
  ]);
}
