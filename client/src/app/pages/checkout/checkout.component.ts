import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartServices } from '../../core/services-old/cart.service';
import { MessengerServices } from '../../core/services-old/messenger.service';
import { PurchaseServices } from '../../core/services-old/purchase.service';
import { StripeServices } from '../../core/services-old/stripe.service';
import { LocalStorageConfig } from '../../shared/clientconfig/localstorageconfig';
import { ConstantValue } from '../../shared/contants/ennum_router';
import { InformationManualBankingModel } from '../../models/infomation-banking';
import { PurchaseOrder } from '../../models/purchase';
import { PurchaseDetailsModel } from '../../models/purchase-details';
import { OrderService } from '@proxy/services/orders';
import { OrderDto } from '@proxy/services/dtos/orders';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    order: OrderDto = {} as OrderDto;
    purchaseCode: string = '';
    totalValue = 0;
    selectedPaymentMethod: PaymentMethod = PaymentMethod.Card;
    readonly PaymentMethod = PaymentMethod;
    paymentOptions = [
        { label: 'Thẻ thanh toán', value: PaymentMethod.Card, icon: 'pi pi-credit-card' },
        { label: 'VNPAY', value: PaymentMethod.Vnpay, icon: 'pi pi-credit-card' }
    ];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly cartServices: CartServices,
        private readonly messengerServices: MessengerServices,
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit(): void {
        const orderId = this.route.snapshot.paramMap.get('orderId');
        this.orderService.get(orderId).subscribe(res => {
            this.order = res;
        });

        this.purchaseCode = this.route.snapshot.paramMap.get('purchaseCode');
        this.totalValue = this.cartServices.courseItems.reduce((c, t1) => t1.totalOrder + c, 0);
    }


    submitCardPayment(): void {

    }
}

enum PaymentMethod {
    Card = 'CARD',
    Vnpay = 'VNPAY'
}
