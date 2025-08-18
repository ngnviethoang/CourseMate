import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { FileRemoveEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { StorageService } from '@proxy/services/storages';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupDto } from '@proxy/services/dtos/lookups';
import { LookupService } from '@proxy/services/lookups';
import { ChapterDto } from '@proxy/services/dtos/chapters';
import { LessonDto } from '@proxy/services/dtos/lessons';
import { LessonService } from '@proxy/services/lessons';
import { ChapterService } from '@proxy/services/chapters';
import { LessonType, lessonTypeOptions } from '@proxy/entities/lessons';

@Component({
  standalone: false,
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class LessonComponent implements OnInit {
  lessons = { items: [], totalCount: 0 } as PagedResultDto<LessonDto>;
  chapter = {} as ChapterDto;
  selectedLesson = {} as LessonDto;
  form: FormGroup;
  isModalOpen = false;
  categories: LookupDto[] = [];
  files: File[] = [];
  private chapterId: string;
  protected readonly lessonTypeOptions = lessonTypeOptions;
  protected readonly LessonType = LessonType;

  constructor(
    public readonly list: ListService,
    private lessonService: LessonService,
    private chapterService: ChapterService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private lookupService: LookupService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.chapterId = this.route.snapshot.paramMap.get('chapterId');

    this.chapterService.get(this.chapterId).subscribe(response => {
      this.chapter = response;
    });

    const lessonStreamCreator = (query) => this.lessonService.getList(
      {
        maxResultCount: query.maxResultCount,
        skipCount: query.skipCount,
        filter: query.filter,
        sorting: query.sorting,
        chapterId: this.chapterId
      }
    );
    this.list.hookToQuery(lessonStreamCreator).subscribe((response) => {
      this.lessons = response;
    });

  }

  backToChapter() {
  }

  create() {
    this.selectedLesson = {} as LessonDto;
    this.buildForm();
    this.generatePosition();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.lessonService.get(id).subscribe(response => {
      this.selectedLesson = response;
      this.buildForm();
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
      lessonType: [this.selectedLesson.lessonType, Validators.required],
      chapterId: [this.selectedLesson.chapterId ?? this.chapterId, [Validators.required, Validators.maxLength(100)]],
      position: [this.selectedLesson.position, [Validators.required, Validators.min(0)]],
      title: [this.selectedLesson.title, [Validators.required, Validators.maxLength(1024)]]
    });

    this.form.get('lessonType')?.valueChanges.subscribe(type => {
      this.switchLessonType(type);
    });

    if (this.selectedLesson.lessonType) {
      this.switchLessonType(this.selectedLesson.lessonType);
    }
  }

  switchLessonType(type: LessonType) {
    // Xóa control cũ nếu có
    ['article', 'video', 'codingExercise', 'quizQuestion'].forEach(ctrl => {
      if (this.form.contains(ctrl)) {
        this.form.removeControl(ctrl);
      }
    });

    // Add form control mới theo type
    switch (type) {
      case LessonType.Article:
        this.form.addControl(
          'article',
          this.fb.group({
            id: [this.selectedLesson.article?.id],
            lessonId: [this.selectedLesson.article?.lessonId],
            content: [this.selectedLesson.article?.content]
          })
        );
        break;

      case LessonType.Video:
        this.form.addControl(
          'video',
          this.fb.group({
            id: [this.selectedLesson.video?.id],
            lessonId: [this.selectedLesson.video?.lessonId],
            videoFile: [this.selectedLesson.video?.videoFile],
            duration: [this.selectedLesson.video?.duration]
          })
        );
        break;

      case LessonType.Coding:
        this.form.addControl(
          'codingExercise',
          this.fb.group({
            id: [this.selectedLesson.codingExercise?.id],
            lessonId: [this.selectedLesson.codingExercise?.lessonId],
            title: [this.selectedLesson.codingExercise?.title],
            description: [this.selectedLesson.codingExercise?.description],
            sampleCodes: this.fb.array([]),
            testCases: this.fb.array([])
          })
        );
        break;

      case LessonType.Quiz:
        this.form.addControl(
          'quizQuestion',
          this.fb.group({
            id: [this.selectedLesson.quizQuestion?.id],
            lessonId: [this.selectedLesson.quizQuestion?.lessonId],
            questionText: [this.selectedLesson.quizQuestion?.questionText],
            quizOptions: this.fb.array([])
          })
        );
        break;
    }
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

  generatePosition() {
    this.lookupService.getMaxPositionLessons(this.chapterId).subscribe(response => {
      this.selectedLesson.position = response + 1;
      this.form.controls['position'].setValue(response + 1);
    });
  }

  addOption() {
    let quizOptions = this.getQuizOption();
    quizOptions.push(this.fb.group({
      text: ['', [Validators.required]],
      isCorrect: [false, [Validators.required]]
    }));
  }

  getQuizOption() {
    return this.form.get('quizQuestion').get('quizOptions') as FormArray;
  }

  onClickClose() {
    this.isModalOpen = false;
  }

  uploadHandler(event: FileUploadHandlerEvent) {
  }

  onRemove(_: FileRemoveEvent) {
  }
}
