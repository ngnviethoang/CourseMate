import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { CourseDto } from '../../proxy/services/dtos/courses';
import { FileSelectEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { StorageService } from '../../proxy/services/storages';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupDto } from '../../proxy/services/dtos/lookups';
import { LookupService } from '../../proxy/services/lookups';
import { ChapterDto } from '../../proxy/services/dtos/chapters';
import { LessonDto } from '../../proxy/services/dtos/lessons';
import { LessonService } from '../../proxy/services/lessons';
import { StorageConstants } from '../../shared/storage-constant';
import { ChapterService } from '../../proxy/services/chapters';

@Component({
  standalone: false,
  selector: 'app-course',
  templateUrl: './order.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class OrderComponent implements OnInit {
  lessons = { items: [], totalCount: 0 } as PagedResultDto<LessonDto>;
  chapter = {} as ChapterDto;
  selectedLesson = {} as LessonDto;
  form: FormGroup;
  isModalOpen = false;
  categories: LookupDto[] = [];
  videoFile: File;
  videoFileUrl: string;
  private chapterId: string;
  maxFileSize = 10 * 1024 * 1024 * 1024; // 10Gb

  constructor(
    public readonly list: ListService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private lookupService: LookupService,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    this.chapterId = this.route.snapshot.queryParamMap.get('chapterId');
    if (this.chapterId === null) {
      this.router.navigateByUrl(`/chapters?courseId=${courseId}`);
    }

    this.chapterService.get(this.chapterId).subscribe(response => {
      this.chapter = response;
    }, _ => {
      this.router.navigateByUrl(`/chapters?courseId=${courseId}`);
    });

    const lessonStreamCreator = (query) => this.lessonService.getList(query);

    this.list.hookToQuery(lessonStreamCreator).subscribe((response) => {
      this.lessons = response;
    });

    const courseStreamCreator = (query) => this.lessonService.getList(query);

    this.list
      .hookToQuery(courseStreamCreator)
      .subscribe((response) => {
        this.lessons = response;
      });

    this.lookupService
      .getCategories({ maxResultCount: null, skipCount: null })
      .subscribe((response) => {
        this.categories = response.items;
      });
  }

  create() {
    this.selectedLesson = {} as LessonDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.lessonService.get(id).subscribe((repsonse) => {
      this.selectedLesson = repsonse;
      this.buildForm();
      this.videoFileUrl = `${StorageConstants.VIDEO_API}?fileName=${repsonse.videoFile}`;
      this.isModalOpen = true;
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.lessonService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selectedLesson.title || null, [Validators.required, Validators.maxLength(1024)]],
      position: [this.selectedLesson.position || 0, [Validators.required, Validators.min(0)]],
      contentText: [this.selectedLesson.contentText || null, [Validators.required, Validators.maxLength(1024)]],
      videoFile: [this.selectedLesson.videoFile || null, [Validators.required, Validators.maxLength(1024)]],
      chapterId: [this.selectedLesson.chapterId || this.chapterId, [Validators.required, Validators.maxLength(100)]]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedLesson.id
      ? this.lessonService.update(this.selectedLesson.id, this.form.value)
      : this.lessonService.create(this.form.value);

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
    this.videoFile = file;
  }

  async onUpload() {
    try {
      if (this.videoFile === null || this.videoFile === undefined) {
        return;
      }
      const formData = new FormData();
      formData.append('streamContent', this.videoFile);
      this.storageService.uploadVideo(formData).subscribe(response => {
        this.videoFileUrl = `${StorageConstants.VIDEO_API}?fileName=${response.name}`;
        this.selectedLesson.videoFile = response.name;
        this.form.controls['videoFile'].setValue(response.name);
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

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched);
  }

  generateSortNumber() {
    this.lookupService.getMaxPositionLessons(this.chapterId).subscribe(response => {
      this.selectedLesson.position = response + 1;
      this.form.controls['position'].setValue(response + 1);
    });
  }
}
