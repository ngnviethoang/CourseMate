import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../proxy/services/courses';
import { CourseDto } from '../../proxy/services/dtos/courses';
import { ChapterService } from '../../proxy/services/chapters';
import { ChapterDto } from '../../proxy/services/dtos/chapters';
import { LookupService } from '../../proxy/services/lookups';

@Component({
  standalone: false,
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class ChapterComponent implements OnInit {
  chapters = { items: [], totalCount: 0 } as PagedResultDto<ChapterDto>;
  selectedChapter = {} as ChapterDto;
  form: FormGroup;
  isModalOpen = false;
  course: CourseDto = {} as CourseDto;
  private courseId: string;

  constructor(
    public readonly list: ListService,
    private chapterService: ChapterService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lookupService: LookupService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.queryParamMap.get('courseId');
    if (this.courseId === null) {
      this.router.navigateByUrl('/courses');
    }

    this.courseService.get(this.courseId).subscribe(response => {
      this.course = response;
    }, error => {
      this.router.navigateByUrl('/courses');
    });

    const chapterStreamCreator = (query) => this.chapterService.getList(
      {
        maxResultCount: query.maxResultCount,
        skipCount: query.skipCount,
        filter: query.filter,
        sorting: query.sorting,
        courseId: this.courseId
      }
    );

    this.list.hookToQuery(chapterStreamCreator).subscribe((response) => {
      this.chapters = response;
    });
  }

  create() {
    this.selectedChapter = {} as ChapterDto;
    this.buildForm();
    this.generatePosition();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.chapterService.get(id).subscribe((book) => {
      this.selectedChapter = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.chapterService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selectedChapter.title || null, Validators.required],
      position: [this.selectedChapter.position || 0, [Validators.required, Validators.min(0)]],
      courseId: [this.selectedChapter.courseId || this.courseId, Validators.required]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedChapter.id
      ? this.chapterService.update(this.selectedChapter.id, this.form.value)
      : this.chapterService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  async onClickLessonManagement(chapterId: string) {
    await this.router.navigateByUrl(`/lessons?courseId=${this.courseId}&chapterId=${chapterId}`);
  }

  generatePosition() {
    this.lookupService
      .getMaxPositionChapters(this.courseId)
      .subscribe(response => {
        this.selectedChapter.position = response + 1;
        this.form.controls['position'].setValue(response + 1);
      });
  }
}
