import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { StudentServices } from '../../core/services-old/student.service';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { StudentUser } from '../../models/student-user';

@Component({
    selector: 'app-account-profile-details',
    templateUrl: './account-profile-details.component.html',
    styleUrls: ['./account-profile-details.component.scss']
})
export class AccountProfileDetailsComponent implements OnInit {

    student: StudentUser;
    isLoading: boolean = false;
    informationOfUser!: UntypedFormGroup;
    generals = [
        { id: 0, name: 'Nam' },
        { id: 1, name: 'Nữ' }
    ];

    constructor(
        private readonly studentServices: StudentServices,
        private readonly messengerServices: MessengerServices,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.getDataOfStudent();
        this.informationOfUser = this.formBuilder.group({
            id: [],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''],
            phone: ['', [Validators.required]],
            general: ['']
        });
    }

    getDataOfStudent() {
        const getUserLocal = LocalStorageConfig.GetUser();
        this.isLoading = true;
        this.studentServices.getStudent(getUserLocal.userId).subscribe(res => {
            if (res.retCode == 0 && res.systemMessage == '') {
                this.student = res.data;
                this.isLoading = false;
                this.informationOfUser.patchValue(this.student);
            } else {
                this.isLoading = false;
                this.messengerServices.errorWithIssue();
            }
        });
    }

    updateStudent() {
        if (this.informationOfUser.valid) {
            this.isLoading = true;
            this.student.name = this.informationOfUser.value.name;
            this.student.email = this.informationOfUser.value.email;
            this.student.password = this.informationOfUser.value.password;
            this.student.phone = this.informationOfUser.value.phone;
            this.student.general = this.informationOfUser.value.general;
            this.studentServices.updateStudent(this.student).subscribe(res => {
                if (res.retCode == 0 && res.systemMessage == '') {
                    this.isLoading = false;
                    this.messengerServices.successes('Cập nhật thông tin người dùng thành công');
                    this.getDataOfStudent();
                } else {
                    this.isLoading = false;
                    this.messengerServices.errorWithIssue();
                }
            });
        } else {
            this.messengerServices.warringWithIssue();
        }

    }

}
