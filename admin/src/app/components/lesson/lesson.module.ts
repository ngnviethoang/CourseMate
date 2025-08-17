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
import { Toast, ToastModule } from 'primeng/toast';
import { Checkbox } from 'primeng/checkbox';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

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
    Toast,
    Checkbox,
    FloatLabel,
    InputNumber,
    InputText,
    Select,
    Textarea,
    TableModule,
    Dialog,
    Ripple,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    DropdownModule,
    Tag,
    RadioButton,
    Rating,
    InputTextModule,
    FormsModule,
    InputNumber,
    IconFieldModule,
    InputIconModule
  ]
})
export class LessonModule {
}
