import { ABP, ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { CourseService } from '@proxy/services/courses';
import { CourseDto } from '@proxy/services/dtos/courses';
import { CurrencyType, currencyTypeOptions, LevelType, levelTypeOptions } from '@proxy/entities/courses';
import { FileRemoveEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { StorageService } from '@proxy/services/storages';
import { Router } from '@angular/router';
import { LookupDto } from '@proxy/services/dtos/lookups';
import { LookupService } from '@proxy/services/lookups';
import Option = ABP.Option;

@Component({
  standalone: false,
  selector: 'app-course',
  templateUrl: './course.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CourseComponent implements OnInit {
  currencyTypes: Option<typeof CurrencyType>[] = currencyTypeOptions;
  levelTypes: Option<typeof LevelType>[] = levelTypeOptions;
  courses: PagedResultDto<CourseDto> = {} as PagedResultDto<CourseDto>;
  selectedCourse: CourseDto = {} as CourseDto;
  form: FormGroup;
  isModalOpen: boolean = false;
  categories: LookupDto[] = [];
  thumbnailFile: File;
  files: File[] = [];

  constructor(
    public readonly list: ListService,
    private courseService: CourseService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private lookupService: LookupService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const courseStreamCreator = (query) => this.courseService.getList(query);

    this.list.hookToQuery(courseStreamCreator).subscribe(response => {
      this.courses = response;
    });

    this.lookupService.getCategories({ maxResultCount: null, skipCount: null }).subscribe(response => {
      this.categories = response.items;
    });
  }

  create() {
    this.selectedCourse = {} as CourseDto;
    this.buildForm();
    this.files = [];
    this.thumbnailFile = null;
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.courseService.get(id).subscribe(response => {
      this.selectedCourse = response;
      this.buildForm();
      this.storageService.getImage(response.thumbnailFile).subscribe(blob => {
        this.thumbnailFile = new File([blob], response.thumbnailFile, { type: blob.type });
        this.files = [];
        this.files.push(this.thumbnailFile);
      });
      this.isModalOpen = true;
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.courseService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selectedCourse.title, [Validators.required, Validators.maxLength(1024)]],
      summary: [this.selectedCourse.summary, [Validators.required, Validators.maxLength(32768)]],
      description: [this.selectedCourse.description, [Validators.required, Validators.maxLength(32768)]],
      thumbnailFile: [this.selectedCourse.thumbnailFile, [Validators.required, Validators.maxLength(1024)]],
      price: [this.selectedCourse.price, [Validators.required, Validators.min(0)]],
      currency: [this.selectedCourse.currency, [Validators.required]],
      levelType: [this.selectedCourse.levelType, [Validators.required]],
      isActive: [this.selectedCourse.isActive ?? true, [Validators.required]],
      categoryId: [this.selectedCourse.categoryId, [Validators.required, Validators.maxLength(100)]]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedCourse.id
      ? this.courseService.update(this.selectedCourse.id, this.form.value)
      : this.courseService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  async onClickChapterManagement(courseId: string) {
    await this.router.navigateByUrl(`/courses/${courseId}/chapters`);
  }

  onClickClose() {
    this.isModalOpen = false;
  }

  uploadHandler(event: FileUploadHandlerEvent) {
    if (this.thumbnailFile === event.files[0]) {
      return;
    }

    try {
      this.thumbnailFile = event.files[0];
      const formData = new FormData();
      formData.append('streamContent', this.thumbnailFile);
      this.storageService.uploadImage(formData).subscribe(response => {
        this.selectedCourse.thumbnailFile = response.name;
        this.form.controls['thumbnailFile'].setValue(response.name);
      });
      this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    } catch (error) {
      console.error('Upload failed:', error);
      this.messageService.add({
        severity: 'error', summary: 'Upload failed', detail: 'There was a problem uploading your file.'
      });
    }
  }

  onRemove(_: FileRemoveEvent) {
    this.storageService.delete(this.thumbnailFile.name).subscribe({
      next: () => {
        this.thumbnailFile = null;
        this.files = [];
        this.selectedCourse.thumbnailFile = null;
        this.form.controls['thumbnailFile'].setValue('');

        this.messageService.add({
          severity: 'info',
          summary: 'File removed',
          detail: 'Thumbnail deleted successfully'
        });
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'There was a problem deleting your file.'
        });
      }
    });
  }
}
