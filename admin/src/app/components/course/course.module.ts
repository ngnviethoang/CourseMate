import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'primeng/image';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';
import { Select } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [CourseComponent],
  imports: [
    CourseRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Image,
    FileUpload,
    Button,
    NgOptimizedImage,
    Select,
    StepperModule,
    InputTextModule,
    FloatLabel,
    Textarea,
    AccordionModule
  ]
})
export class CourseModule {
}
