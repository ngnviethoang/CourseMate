import { AuthService } from '@abp/ng.core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(private authService: AuthService) {
    }

    get hasLoggedIn(): boolean {
        return this.authService.isAuthenticated;
    }

    login() {
        this.authService.navigateToLogin();
    }
}
