import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard, permissionGuard } from '@abp/ng.core';
import { StudentComponent } from './student.component';

const routes: Routes = [
  { path: '', component: StudentComponent, canActivate: [authGuard, permissionGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
}
