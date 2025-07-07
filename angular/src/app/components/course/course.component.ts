import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { CourseService } from '../../proxy/services/courses';
import { CourseDto } from '../../proxy/services/dtos/courses';
import { CurrencyType, currencyTypeOptions, LevelType, levelTypeOptions } from '../../proxy/entities/courses';
import { FileSelectEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../proxy/services/storages';
import { Router } from '@angular/router';
import { LookupDto } from '../../proxy/services/dtos/lookups';
import { LookupService } from '../../proxy/services/lookups';
import { StorageConstants } from '../../shared/storage-constant';

@Component({
  standalone: false,
  selector: 'app-course',
  templateUrl: './course.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CourseComponent implements OnInit {
  courses = { items: [], totalCount: 0 } as PagedResultDto<CourseDto>;
  selectedCourse = {} as CourseDto; // declare selectedBook
  form: FormGroup;
  currencyTypes = currencyTypeOptions;
  levelTypes = levelTypeOptions;
  isModalOpen = false;
  categories: LookupDto[] = [];
  thumbnailFile: File;
  thumbnailUrl: string;

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

    this.list
      .hookToQuery(courseStreamCreator)
      .subscribe((response) => {
        this.courses = response;
      });

    this.lookupService
      .getCategories({ maxResultCount: null, skipCount: null })
      .subscribe((response) => {
        this.categories = response.items;
      });
  }

  create() {
    this.selectedCourse = {} as CourseDto; // reset the selected book
    this.buildForm();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.courseService.get(id).subscribe((response) => {
      this.selectedCourse = response;
      this.buildForm();
      this.isModalOpen = true;
      this.thumbnailUrl = `${StorageConstants.IMAGE_API}?fileName=${response.thumbnailFile}`;
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
      title: [this.selectedCourse.title || '', [Validators.required, Validators.maxLength(1024)]],
      description: [this.selectedCourse.description || '', [Validators.maxLength(1024)]],
      thumbnailFile: [this.selectedCourse.thumbnailFile || '', [Validators.maxLength(1024)]],
      price: [this.selectedCourse.price || null, [Validators.required, Validators.min(0)]],
      currency: [this.selectedCourse.currency || CurrencyType.Usd, [Validators.required]],
      levelType: [this.selectedCourse.levelType || LevelType.Beginner, [Validators.required]],
      isPublished: [this.selectedCourse.isPublished || true, [Validators.required]],
      categoryId: [this.selectedCourse.categoryId || '', [Validators.required, Validators.maxLength(100)]],
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

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];
    if (!file) {
      return;
    }
    this.thumbnailFile = file;
  }

  async onUpload() {
    try {
      if (this.thumbnailFile === null || this.thumbnailFile === undefined) {
        return;
      }
      const formData = new FormData();
      formData.append('streamContent', this.thumbnailFile);
      this.storageService.uploadImage(formData).subscribe(response => {
        this.thumbnailUrl = `${StorageConstants.IMAGE_API}?fileName=${response.name}`;
        this.selectedCourse.thumbnailFile = response.name;
        this.form.controls['thumbnailFile'].setValue(response.name);
      });

      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'File uploaded successfully'
      });
    } catch (error) {
      console.error('Upload failed:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Upload failed',
        detail: 'There was a problem uploading your file.'
      });
    }
  }

  async onClickChapterManagement(courseId: string) {
    await this.router.navigateByUrl(`/chapters?courseId=${courseId}`);
  }
}
