import { Component, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { CategoryDto } from '@proxy/services/dtos/categories';
import { GetListCourseRequestDto } from '../../models/request.models';
import { CourseDto } from '@proxy/services/dtos/courses';
import { CourseService } from '@proxy/services/courses';
import { CategoryService } from '@proxy/services/categories';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
    pagedResult: PagedResultDto<CourseDto> = new PagedResultDto<CourseDto>();
    getListCourseReq: GetListCourseRequestDto = {
        maxResultCount: 12,
        categoryId: null,
        skipCount: 0,
        sorting: 'name'
    };
    categories: CategoryDto[] = [];
    currentPage: number = 1;
    totalPages: number = 1;
    pages: number[] = [];

    constructor(private courseService: CourseService,
                private categoryService: CategoryService) {
    }


    ngOnInit(): void {
        this.categoryService
            .getList({})
            .subscribe(response => this.categories = response.items);

        this.getListCourseReq.maxResultCount = 2;
        this.getListCourse();
    }

    onChangeCategory(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.getListCourseReq.categoryId = target.value || null;
        this.getListCourse();
    }

    getListCourse() {
        this.courseService.getList(this.getListCourseReq).subscribe((response) => {
            this.pagedResult = response;
            this.totalPages = Math.ceil(this.pagedResult.totalCount / this.getListCourseReq.maxResultCount);
            this.generatePageNumbers();
        });
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


