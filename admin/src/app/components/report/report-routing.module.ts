import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard, permissionGuard } from '@abp/ng.core';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: '', component: ReportComponent /*canActivate: [authGuard, permissionGuard] */ }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
