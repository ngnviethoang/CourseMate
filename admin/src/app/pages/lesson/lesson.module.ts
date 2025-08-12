import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LessonRoutingModule } from './lesson-routing.module';
import { LessonComponent } from './lesson.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'primeng/image';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { Editor } from 'primeng/editor';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast'; // add this line

@NgModule({
  declarations: [LessonComponent],
  imports: [
    LessonRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Image,
    FileUpload,
    Button,
    Editor,
    Message,
    Toast
    // add this line
  ]
})
export class LessonModule {
}
