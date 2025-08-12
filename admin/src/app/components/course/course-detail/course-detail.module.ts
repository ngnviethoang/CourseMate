import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CourseDetailComponent } from './course-detail.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'primeng/image';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';
import { Select } from 'primeng/select';
import { CourseRoutingModule } from '../course-routing.module';

@NgModule({
  declarations: [CourseDetailComponent],
  imports: [
    CourseRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Image,
    FileUpload,
    Button,
    NgOptimizedImage,
    Select
  ]
})
export class CourseDetailModule {
}
