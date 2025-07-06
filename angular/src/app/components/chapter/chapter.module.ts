import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChapterRoutingModule } from './chapter-routing.module';
import { ChapterComponent } from './chapter.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Select } from 'primeng/select'; // add this line

@NgModule({
  declarations: [ChapterComponent],
  imports: [
    ChapterRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Select
    // add this line
  ]
})
export class ChapterModule {
}
