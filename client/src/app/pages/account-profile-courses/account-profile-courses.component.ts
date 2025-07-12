import { Component, OnInit } from '@angular/core';
import { StudentServices } from '../../core/services-old/student.service';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { Course } from '../../models/course';
import { LoginRegister } from '../../models/response-models/login-register-respone';

@Component({
    selector: 'app-account-profile-courses',
    templateUrl: './account-profile-courses.component.html',
    styleUrls: ['./account-profile-courses.component.scss']
})
export class AccountProfileCoursesComponent implements OnInit {

    value: string = '100%';
    courses: Course[] = [];
    user: LoginRegister;

    constructor(
        private readonly studentServices: StudentServices
    ) {
    }

    ngOnInit() {
        this.getDataCourseStudent();
        this.getInfomationOfUser();
    }

    getDataCourseStudent() {
        this.studentServices.getDataCourseOfStudent().subscribe((res) => {
            if (res.retCode === 0 && res.systemMessage === '') {
                this.courses = res.data;
            }
        });
    }

    getInfomationOfUser() {
        this.user = LocalStorageConfig.GetUser();
    }

}
