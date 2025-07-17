import { Component, OnInit } from '@angular/core';
import { CartServices } from '../../core/services-old/cart.service';
import { CourseServices } from '../../core/services-old/course.service';
import { StudentServices } from '../../core/services-old/student.service';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { Course } from '../../models/course';
import { LoginRegister } from '../../models/response-models/login-register-respone';

@Component({
    selector: 'app-account-bookmark-training-online',
    templateUrl: './account-bookmark-course.component.html',
    styleUrls: ['./account-bookmark-course.component.scss']
})
export class AccountBookmarkCourseComponent implements OnInit {
    value: string = '100%';
    course: Course[] = [];
    user: LoginRegister;

    constructor(
        private readonly studentServices: StudentServices,
        private readonly cartServices: CartServices,
        private readonly courseServices: CourseServices
    ) {
    }

    ngOnInit() {

        this.loadListBookmarkCourseOfUser();
        this.getInfomationOfUser();
    }

    loadListBookmarkCourseOfUser() {
        this.studentServices.getListBookmarkCourse().subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.course = res.data;
            } else {
                this.course = [];
            }
        });
    }

    getInfomationOfUser() {
        this.user = LocalStorageConfig.GetUser();
    }

    addCourseToCart(idCourse: number) {
        this.courseServices.getCourses(idCourse).subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.cartServices.addCourse(res.data);
            }
        });
    }
}
