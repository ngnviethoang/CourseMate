import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ConfigStateService } from '@abp/ng.core';
import { CartService } from '@proxy/services/carts';
import { CartDto } from '@proxy/services/dtos/carts';
import { MessageService } from '@services';
import { OrderService } from '@proxy/services/orders';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    totalValue = 0;
    carts: CartDto[] = [];

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService,
        private readonly authService: AuthService,
        private readonly cartService: CartService,
        private readonly configStateService: ConfigStateService,
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit(): void {
        const currentUser = this.configStateService.getOne('currentUser');
        this.cartService.getList({ studentId: currentUser.id }).subscribe(res => {
            this.carts = res.items;
        });
    }

    async removeItem(courseId: string) {
        this.cartService.delete(courseId).subscribe({
            next: () => {
                this.carts = this.carts.filter(i => i.id !== courseId);
                this.totalValue = this.carts.reduce((sum, item) => sum + item.course.price, 0);
                this.messageService.success('Thông báo', 'Xóa khóa học khỏi giỏ hàng thành công!');
            },
            error: (err) => {
                this.messageService.error('Lỗi', 'Không thể xóa khóa học. Vui lòng thử lại sau.');
            }
        });
    }

    async onClickCheckout() {
        if (this.authService.isAuthenticated) {
            this.orderService.create({ courseIds: this.carts.map(cart => cart.courseId) }).subscribe(res => {
                const orderId = res.id;
                this.router.navigate([`/checkout/${orderId}`]);
            });
        } else {
            await this.messageService.warringBookMarkCourse('Vui lòng đăng nhập để thực hiện thanh toán!');
        }
    }

    loginAccount() {
        this.authService.navigateToLogin();
    }

    isAuthenticated() {
        return this.authService.isAuthenticated;
    }
}
