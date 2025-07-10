import { Component, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { IndicatorLoadingService } from '../../core/ui-services/indicator-loading.service';
import { CourseDto, CourseService, GetListCourseRequestDto } from '@proxy/catalog-managements/courses';
import { CategoryDto, CategoryService } from '@proxy/catalog-managements/categories';

@Component({
    selector: 'app-products-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
    imports: [
        RouterLink,
        NgOptimizedImage,
        NgForOf,
        NgClass
    ],
    standalone: true
})
export class CourseListComponent implements OnInit {
    pagedResult: PagedResultDto<CourseDto> = new PagedResultDto<CourseDto>();
    getListCourseReq: GetListCourseRequestDto;
    categories: CategoryDto[] = [];
    currentPage: number = 1;
    totalPages: number = 1;
    pages: number[] = [];

    constructor(private courseService: CourseService,
                private categoryService: CategoryService,
                private loadingService: IndicatorLoadingService) {
    }

    ngOnInit(): void {
        this.categoryService
            .getAll()
            .subscribe(response => this.categories = response);

        this.getListCourseReq.maxResultCount = 16;
        this.getListCourse();
    }

    onChangeCategory(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.getListCourseReq.categoryId = target.value || null;
        this.getListCourse();
    }

    getListCourse() {
        this.loadingService.show();
        this.courseService.getList(this.getListCourseReq).subscribe((response) => {
            this.pagedResult = response;
            this.totalPages = Math.ceil(this.pagedResult.totalCount / this.getListCourseReq.maxResultCount);
            this.generatePageNumbers();
        });
        this.loadingService.hide();
    }

    generatePageNumbers(): void {
        const pages = [];
        const pageSize = this.getListCourseReq.maxResultCount;
        const totalPages = Math.ceil(this.pagedResult.totalCount / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        this.pages = pages;
    }

    changePage(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
        this.getListCourseReq.skipCount = (page - 1) * this.getListCourseReq.maxResultCount;
        this.getListCourse();
    }
}
