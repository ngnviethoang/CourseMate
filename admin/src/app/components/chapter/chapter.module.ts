import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ChapterRoutingModule } from './chapter-routing.module';
import { ChapterComponent } from './chapter.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea'; // add this line

@NgModule({
  declarations: [ChapterComponent],
  imports: [
    ChapterRoutingModule,
    SharedModule,
    NgbDatepickerModule,
    Select,
    Button,
    Checkbox,
    FileUpload,
    FloatLabel,
    InputNumber,
    InputText,
    Textarea
    // add this line
  ]
})
export class ChapterModule {
}
