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
    listCourses: Course[] = [
        {
            id: 1,
            title: 'Introduction to TypeScript',
            description: 'Learn the basics of TypeScript, types, interfaces, and more.',
            shortDescription: '',
            isFree: false,
            introduce: '',
            idCategory: 0,
            levelCourse: '',
            languages: '',
            publicId: '',
            pictureUrl: '',
            keyVideoUpload: '',
            fileUrl: '',
            processCourse: 0,
            vote3Star: 0,
            vote4Star: 0,
            averageScore: 0
        },
        {
            id: 2,
            title: 'Advanced Angular',
            description: 'Deep dive into Angular services, RxJS, and performance optimization.',
            shortDescription: '',
            isFree: false,
            introduce: '',
            idCategory: 0,
            levelCourse: '',
            languages: '',
            publicId: '',
            pictureUrl: '',
            keyVideoUpload: '',
            fileUrl: '',
            processCourse: 0,
            vote3Star: 0,
            vote4Star: 0,
            averageScore: 0
        },
        {
            id: 3,
            title: 'Web Development with Node.js',
            description: 'Build backend APIs using Node.js, Express, and MongoDB.',
            shortDescription: '',
            isFree: false,
            introduce: '',
            idCategory: 0,
            levelCourse: '',
            languages: '',
            publicId: '',
            pictureUrl: '',
            keyVideoUpload: '',
            fileUrl: '',
            processCourse: 0,
            vote3Star: 0,
            vote4Star: 0,
            averageScore: 0
        }
    ];

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
            // this.loadDataCourseOfCategory(this.idCategory);
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
