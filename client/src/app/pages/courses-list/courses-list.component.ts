import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseServices } from '../../core/services-old/course.service';
import { Course } from '../../models/course';

@Component({
    selector: 'app-courses-list',
    templateUrl: './courses-list.component.html',
    styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {

    idCategory: number = 0;
    listCourses: Course[] = [];
    isLoading = false;

    constructor(
        private readonly router: ActivatedRoute,
        private readonly courseServices: CourseServices
    ) {
    }

    ngOnInit(): void {
        this.idCategory = Number(this.router.snapshot.paramMap.get('id'));
        this.router.params.subscribe((params) => {
            this.idCategory = Number(this.router.snapshot.paramMap.get('id'));
            this.loadDataCourseOfCategory(this.idCategory);
        });
    }

    pageChanged(event) {
        console.log(event);
    }

    loadDataCourseOfCategory(id: number) {
        this.isLoading = true;
        this.courseServices.getListCourseAsCategory(id).subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.listCourses = res.data;
                this.isLoading = false;
            } else {
                this.listCourses = [];
                this.isLoading = false;
            }
        });
    }

}
