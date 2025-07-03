import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // add this line

@NgModule({
  declarations: [CourseComponent],
  imports: [
    CourseRoutingModule,
    SharedModule,
    NgbDatepickerModule // add this line
  ]
})
export class CourseModule {
}
