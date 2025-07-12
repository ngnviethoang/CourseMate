import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { StudentServices } from '../../core/services-old/student.service';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { RootCoreModule } from '@abp/ng.core';

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile.component.html',
    standalone: true,
    imports: [
        RootCoreModule
    ],
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    student: any = {};
    isLoading: boolean = false;
    profileForm: FormGroup;
    passwordForm: FormGroup;
    activeTab: string = 'profile';
    registeredCourses: any[] = [];

    genders = [
        { id: 0, name: 'Nam' },
        { id: 1, name: 'Nữ' }
    ];

    constructor(
        private readonly studentServices: StudentServices,
        private readonly messengerServices: MessengerServices,
        private formBuilder: FormBuilder
    ) {
        this.profileForm = this.formBuilder.group({
            id: [''],
            name: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
            gender: [0]
        });

        this.passwordForm = this.formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.loadStudentData();
    }

    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    loadStudentData() {
        // Dữ liệu cứng
        const studentData = {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0987654321',
            gender: 0
        };

        this.student = studentData;
        this.profileForm.patchValue(studentData);
    }

    // loadStudentData() {
    //     const userLocal = LocalStorageConfig.GetUser();
    //     if (!userLocal || !userLocal.userId) {
    //         this.showError('Không thể xác thực người dùng');
    //         return;
    //     }
    //
    //     this.isLoading = true;
    //     this.studentServices.getStudent(userLocal.userId).subscribe({
    //         next: (res: any) => {
    //             if (res.retCode === 0 && res.data) {
    //                 this.student = res.data;
    //                 this.profileForm.patchValue({
    //                     id: this.student.id,
    //                     name: this.student.name,
    //                     email: this.student.email,
    //                     phone: this.student.phone,
    //                     gender: this.student.gender || 0
    //                 });
    //             } else {
    //                 this.showError(res.systemMessage || 'Không thể tải thông tin sinh viên');
    //             }
    //             this.isLoading = false;
    //         },
    //         error: (err) => {
    //             this.showError('Lỗi kết nối đến server');
    //             this.isLoading = false;
    //         }
    //     });
    // }

    updateProfile() {
        if (this.profileForm.invalid) {
            this.markFormGroupTouched(this.profileForm);
            this.showError('Vui lòng kiểm tra lại thông tin');
            return;
        }

        this.isLoading = true;
        const updatedData = this.profileForm.value;

        this.studentServices.updateStudent(updatedData).subscribe({
            next: (res: any) => {
                if (res.retCode === 0) {
                    this.student = { ...this.student, ...updatedData };
                    this.showSuccess('Cập nhật thông tin thành công');
                } else {
                    this.showError(res.systemMessage || 'Cập nhật thất bại');
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.showError('Lỗi khi cập nhật thông tin');
                this.isLoading = false;
            }
        });
    }

    changePassword() {
        if (this.passwordForm.invalid) {
            this.markFormGroupTouched(this.passwordForm);
            this.showError('Vui lòng kiểm tra lại thông tin mật khẩu');
            return;
        }

        this.isLoading = true;
        const passwordData = {
            userId: this.student.id,
            currentPassword: this.passwordForm.value.currentPassword,
            newPassword: this.passwordForm.value.newPassword
        };

        // Giả lập chức năng đổi mật khẩu
        setTimeout(() => {
            this.showSuccess('Đổi mật khẩu thành công (demo)');
            this.passwordForm.reset();
            this.isLoading = false;
        }, 1000);

        /*
        this.studentServices.changePassword(passwordData).subscribe({
          next: (res: any) => {
            if (res.retCode === 0) {
              this.showSuccess('Đổi mật khẩu thành công');
              this.passwordForm.reset();
            } else {
              this.showError(res.systemMessage || 'Đổi mật khẩu thất bại');
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.showError('Lỗi khi đổi mật khẩu');
            this.isLoading = false;
          }
        });
        */
    }

    switchTab(tab: string) {
        this.activeTab = tab;
        if (tab === 'courses' && this.registeredCourses.length === 0) {
            this.loadRegisteredCourses();
        }
    }

    loadRegisteredCourses() {
        this.isLoading = true;
        setTimeout(() => {
            this.registeredCourses = [
                {
                    id: 1,
                    name: 'Lập trình Angular cơ bản',
                    description: 'Khóa học căn bản về Angular framework',
                    progress: 65,
                    registrationDate: new Date('2023-01-15')
                },
                {
                    id: 2,
                    name: 'JavaScript nâng cao',
                    description: 'Các kỹ thuật nâng cao trong JavaScript',
                    progress: 30,
                    registrationDate: new Date('2023-03-20')
                }
            ];
            this.isLoading = false;
        }, 800);

        /*
        this.studentServices.getRegisteredCourses(this.student.id).subscribe({
          next: (res: any) => {
            if (res.retCode === 0) {
              this.registeredCourses = res.data || [];
            } else {
              this.showError(res.systemMessage || 'Lỗi tải danh sách khóa học');
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.showError('Lỗi kết nối khi tải khóa học');
            this.isLoading = false;
          }
        });
        */
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    private showSuccess(message: string) {
        this.messengerServices.successes(message);
    }

    private showError(message: string) {
        this.messengerServices.error('Lỗi', message);
    }
}
