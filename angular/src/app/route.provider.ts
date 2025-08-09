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
      name: '::Menu:Dashboard',
      iconClass: 'fas fa-tachometer-alt',
      order: 1,
      layout: eLayoutType.application
    },
    {
      path: '/courses',
      name: '::Menu:Courses',
      iconClass: 'fas fa-graduation-cap',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Courses'
    },
    {
      path: '/categories',
      name: '::Menu:Categories',
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      requiredPolicy: 'CourseMate.Categories'
    },
    {
      path: '/orders',
      name: '::Menu:Orders',
      iconClass: 'fas fa-shopping-cart',
      requiredPolicy: 'CourseMate.Orders',
      layout: eLayoutType.application
    },
    {
      path: '/report',
      name: '::Menu:Reports',
      iconClass: 'fas fa-chart-line',
      // requiredPolicy: 'CourseMate.Reports',
      layout: eLayoutType.application
    }
  ]);
}
