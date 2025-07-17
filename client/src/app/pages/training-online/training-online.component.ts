import { Component, OnInit } from '@angular/core';
import { PagedResultDto } from '@abp/ng.core';
import { CategoryDto } from '@proxy/services/dtos/categories';
import { CourseDto, GetListCourseRequestDto } from '@proxy/services/dtos/courses';
import { CourseService } from '@proxy/services/courses';
import { CategoryService } from '@proxy/services/categories';
import { PaginatorState } from 'primeng/paginator';
import { SelectChangeEvent } from 'primeng/select';

@Component({
    selector: 'app-training-online',
    templateUrl: './training-online.component.html',
    styleUrls: ['./training-online.component.scss']
})
export class TrainingOnlineComponent implements OnInit {
    pagedResult: PagedResultDto<CourseDto> = new PagedResultDto<CourseDto>();
    categories: CategoryDto[] = [];
    first: number = 0;
    rows: number = 12;
    sortByOptions: { id: number; name: string }[] = [
        { id: 1, name: 'Popularity' },
        { id: 2, name: 'Latest' },
        { id: 3, name: 'Price: low to high' },
        { id: 4, name: 'Price: high to low' }
    ];
    getListCourseReq: GetListCourseRequestDto = {
        maxResultCount: 12,
        categoryId: null,
        skipCount: 0,
        sorting: null
    };

    constructor(private courseService: CourseService,
                private categoryService: CategoryService) {
    }

    ngOnInit(): void {
        this.categoryService
            .getList({})
            .subscribe(response => this.categories = response.items);

        this.getListCourse(this.getListCourseReq);
    }

    onChangeCategory(event: SelectChangeEvent) {
        this.getListCourseReq.categoryId = event.value || null;
        this.getListCourse(this.getListCourseReq);
    }

    getListCourse(getListCourseReq: GetListCourseRequestDto) {
        this.courseService
            .getList(getListCourseReq)
            .subscribe((response) => {
                this.pagedResult = response;
            });
    }

    onPageChange(event: PaginatorState) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 12;
        this.getListCourseReq.maxResultCount = event.rows;
        this.getListCourseReq.skipCount = this.first;
        this.getListCourse(this.getListCourseReq);
    }
}


