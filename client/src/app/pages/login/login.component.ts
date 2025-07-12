import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { AuthService } from '@abp/ng.core';
// import { AuthenticationService } from '../../core/services/authentication.service';
import { LoginRequestDto } from '../../models/request.models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    isLoading = false;

    constructor(
        private authService: AuthService,
        // private readonly authenticationService: AuthenticationService,
        private readonly externalAuthService: SocialAuthService,
        private readonly router: Router,
        private readonly messengerServices: MessengerServices,
        private formBuilder: FormBuilder
    ) {

        this.loginForm = this.formBuilder.group({
            userNameOrEmailAddress: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnInit() {
        this.externalAuthService.authState.subscribe((user: SocialUser) => {
            if (user.id && user.idToken) {
                this.loginWithGoogle(user);
            }
        });
    }

    loginWithGoogle(model: SocialUser) {
        /*  this.authenticationService.loginWithGoogle(model).subscribe((res) => {
              if (res.retCode == 0 && res.systemMessage == '') {
                  LocalStorageConfig.SetUser(res.data);
                  this.authenticationService.updateAfterLogin(res.data);
                  this.router.navigate([`/`]);
                  this.isLoading = false;
              } else {
                  this.isLoading = false;
                  this.messengerServices.errorWithIssue();
              }
          });*/
    }

    loginWithFaceBook() {
        /* this.isLoading = true;
         this.externalAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res: SocialUser) => {
             if (res.authToken && res.id) {
                 this.authenticationService.loginWithFaceBook(res).subscribe((res) => {
                     if (res.retCode == 0 && res.systemMessage == '') {
                         this.isLoading = false;
                         LocalStorageConfig.SetUser(res.data);
                         this.authenticationService.updateAfterLogin(res.data);
                         this.router.navigate([`/`]);
                     } else {
                         this.isLoading = false;
                         this.messengerServices.errorWithIssue();
                     }
                 });
             }
         });*/
    }

    loginWithEmail() {
        let req: LoginRequestDto = {
            password: this.loginForm.get('password').value,
            userNameOrEmailAddress: this.loginForm.get('userNameOrEmailAddress').value,
            rememberMe: this.loginForm.get('rememberMe').value
        };
        // this.authenticationService.login(req).subscribe(async (res) => {
        //     if (res.result == 1) {
        //         await this.messengerServices.success('Thông báo', 'Đăng nhập thành công');
        //         await this.router.navigate(['/']);
        //     } else {
        //         await this.messengerServices.error('Thông báo', res.description);
        //     }
        // });
    }
}
