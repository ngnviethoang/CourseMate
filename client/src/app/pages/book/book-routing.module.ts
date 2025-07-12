import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, permissionGuard } from '@abp/ng.core';
import { BookComponent } from './book.component';

const routes: Routes = [
    { path: '', component: BookComponent, canActivate: [authGuard, permissionGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookRoutingModule {
}
