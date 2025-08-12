import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorComponent } from './instructor.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [InstructorComponent],
  imports: [
    InstructorRoutingModule,
    SharedModule,
    NgbDatepickerModule
  ]
})
export class InstructorModule {
}
