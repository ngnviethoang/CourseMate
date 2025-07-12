import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-payment-success',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

    constructor(
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
    }

    goToHome() {
        this.router.navigate(['/']);
    }

}
