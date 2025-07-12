import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'primeng/image';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common'; // add this line

@NgModule({
  declarations: [StudentComponent],
  imports: [
    StudentRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Image,
    FileUpload,
    Button,
    NgOptimizedImage
    // add this line
  ]
})
export class StudentModule {
}
