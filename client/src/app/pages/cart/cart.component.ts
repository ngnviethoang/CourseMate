import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartServices } from '../../core/services-old/cart.service';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { PurchaseServices } from '../../core/services-old/purchase.service';
import { AuthService } from '@abp/ng.core';
import { BasketDto, BasketService } from '@proxy/cashiering-managements/baskets';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    totalValue = 0;
    basketDto: BasketDto;

    constructor(
        public readonly cartServices: CartServices,
        private readonly purchaseServices: PurchaseServices,
        private readonly router: Router,
        private readonly messengerServices: MessengerServices,
        private readonly basketService: BasketService,
        private readonly authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.basketService.getAll().subscribe((response) => {
            this.basketDto = response;
        });
    }

    removeItemOnCart(courseId: string) {
        // this.cartServices.removeCourse(item);
        this.totalValue = this.cartServices.courseItems.reduce((c, t1) => t1.totalOrder + c, 0);
    }

    async goToPaymentForCourse() {
        if (this.authService.isAuthenticated) {
            await this.router.navigate([`/payment/${3132}`]);
        } else {
            this.messengerServices.warringBookMarkCourse('Vui lòng đăng nhập để thực hiện thanh toán!');
        }
    }

    loginAccount() {
        this.authService.navigateToLogin();
    }

    isAuthenticated() {
        return this.authService.isAuthenticated;
    }
}
