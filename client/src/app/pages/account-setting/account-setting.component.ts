import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.component.html',
    styleUrls: ['./account-setting.component.scss'],
    standalone: false
})
export class AccountSettingComponent implements OnInit {
    user: IdentityUserDto = {} as IdentityUserDto;
    form: FormGroup;
    generals = [
        { id: 0, name: 'Nam' },
        { id: 1, name: 'Nữ' }
    ];
    menuItems: MenuItem[] = [
        { label: 'Learning Path', active: false },
        { label: 'Profile', active: false },
        { label: 'Account Security', active: true },
        { label: 'Close account', active: false }
    ];

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.getDataOfStudent();
        this.form = this.formBuilder.group({
            id: [],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''],
            phone: ['', [Validators.required]],
            general: ['']
        });
    }


    selectMenu(item: any) {
        this.menuItems.forEach(i => i.active = false);
        item.active = true;
    }

    getDataOfStudent() {
        /* const getUserLocal = LocalStorageConfig.GetUser();
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
         });*/
    }

    save() {
        /* if (this.informationOfUser.valid) {
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
         }*/

    }
}
