import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationServices } from '../../core/services-old/authentication.service';
import { MessengerServices } from '../../core/services-old/messenger.service';

@Component({
    selector: 'app-register-pages',
    templateUrl: './register-pages.component.html',
    styleUrls: ['./register-pages.component.scss']
})
export class RegisterPagesComponent implements OnInit {

    registerForm!: UntypedFormGroup;
    isLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private readonly authenticationServices: AuthenticationServices,
        private readonly messengerServices: MessengerServices,
        private readonly externalAuthService: SocialAuthService,
        private readonly authenticationService: AuthenticationServices,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''],
            phone: ['', [Validators.required]]
        });

        this.externalAuthService.authState.subscribe((user: SocialUser) => {
            if (user.id && user.idToken) {
                this.loginWithGoogle(user);
            }
        });
    }

    registerUser() {
        this.authenticationServices.registerUser(this.registerForm.value.name,
            this.registerForm.value.password, this.registerForm.value.email, this.registerForm.value.phone).subscribe(res => {
            if (res.retCode == 0 && res.systemMessage == '') {
                this.registerForm.reset();
            } else {
                this.messengerServices.errorWithIssue();
            }
        });
    }

    loginWithGoogle(model: SocialUser) {
        this.isLoading = true;
        this.authenticationService.loginWithGoogle(model).subscribe((res) => {
            if (res.retCode == 0 && res.systemMessage == '') {
                this.isLoading = false;
                this.router.navigate([`/`]);
            } else {
                this.isLoading = false;
                this.messengerServices.errorWithIssue();
            }
        });
    }

    loginWithFaceBook() {
        this.externalAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res: SocialUser) => {
            this.isLoading = true;
            if (res.authToken && res.id) {
                this.authenticationService.loginWithFaceBook(res).subscribe((res) => {
                    if (res.retCode == 0 && res.systemMessage == '') {
                        this.isLoading = false;
                        this.router.navigate([`/`]);
                    } else {
                        this.isLoading = false;
                        this.messengerServices.errorWithIssue();
                    }
                });
            }
        });
    }

}
