import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PaymentRequestRoutingModule } from './payment-request-routing.module';
import { PaymentRequestComponent } from './payment-request.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Image } from 'primeng/image';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { Editor } from 'primeng/editor';
import { Message } from 'primeng/message';
import { Toast } from 'primeng/toast'; // add this line

@NgModule({
  declarations: [PaymentRequestComponent],
  imports: [
    PaymentRequestRoutingModule,
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
export class PaymentRequestModule {
}
