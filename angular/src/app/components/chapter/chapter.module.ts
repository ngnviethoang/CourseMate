import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChapterRoutingModule } from './chapter-routing.module';
import { ChapterComponent } from './chapter.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // add this line

@NgModule({
  declarations: [ChapterComponent],
  imports: [
    ChapterRoutingModule,
    SharedModule,
    NgbDatepickerModule // add this line
  ]
})
export class ChapterModule {
}
