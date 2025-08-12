import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CategoryRoutingModule,
    SharedModule,
    NgbDatepickerModule
  ]
})
export class CategoryModule {
}
