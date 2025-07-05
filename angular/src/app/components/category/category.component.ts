import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { CourseDto } from '../../proxy/services/dtos/courses';
import { CategoryDto } from '../../proxy/services/dtos/categories';
import { CategoryService } from '../../proxy/services/categories';

@Component({
  standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CategoryComponent implements OnInit {
  categories = { items: [], totalCount: 0 } as PagedResultDto<CategoryDto>;
  selectedCategory = {} as CategoryDto;
  form: FormGroup;
  isModalOpen = false;

  constructor(
    public readonly list: ListService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService // inject the ConfirmationService
  ) {
  }

  ngOnInit() {
    const streamCreator = (query) => this.categoryService.getList(query);

    this.list.hookToQuery(streamCreator).subscribe((response) => {
      this.categories = response;
    });
  }

  create() {
    this.selectedCategory = {} as CourseDto; // reset the selected book
    this.buildForm();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.categoryService.get(id).subscribe((category) => {
      this.selectedCategory = category;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.categoryService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedCategory.name || '', [Validators.required, Validators.maxLength(1024)]],
      description: [this.selectedCategory.description || '', [Validators.maxLength(1024)]]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedCategory.id
      ? this.categoryService.update(this.selectedCategory.id, this.form.value)
      : this.categoryService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }
}
