import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LessonRoutingModule } from './lesson-routing.module';
import { LessonComponent } from './lesson.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // add this line

@NgModule({
  declarations: [LessonComponent],
  imports: [
    LessonRoutingModule,
    SharedModule,
    NgbDatepickerModule // add this line
  ]
})
export class LessonModule {
}
