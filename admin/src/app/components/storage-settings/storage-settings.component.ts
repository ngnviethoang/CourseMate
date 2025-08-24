import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-storage-settings',
  standalone: false,
  templateUrl: './storage-settings.component.html'
})
export class StorageSettingsComponent {
  form: FormGroup;

  buildForm() {
  }
}
