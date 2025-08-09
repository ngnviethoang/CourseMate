import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';
import type { ReturnUrlRequestDto } from '../services/dtos/vn-pay/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiName = 'Default';
  

  getVnPaymentByOrderId = (orderId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/v1/payments/vnpay/${orderId}`,
    },
    { apiName: this.apiName,...config });
  

  vnPayIpnUrlCallbackByInput = (input: ReturnUrlRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/v1/payments/ipn',
      params: { vnp_TmnCode: input.vnp_TmnCode, vnp_Amount: input.vnp_Amount, vnp_BankCode: input.vnp_BankCode, vnp_BankTranNo: input.vnp_BankTranNo, vnp_CardType: input.vnp_CardType, vnp_PayDate: input.vnp_PayDate, vnp_OrderInfo: input.vnp_OrderInfo, vnp_TransactionNo: input.vnp_TransactionNo, vnp_ResponseCode: input.vnp_ResponseCode, vnp_TransactionStatus: input.vnp_TransactionStatus, vnp_TxnRef: input.vnp_TxnRef, vnp_SecureHashType: input.vnp_SecureHashType, vnp_SecureHash: input.vnp_SecureHash },
    },
    { apiName: this.apiName,...config });
  

  vnPayReturnUrlCallbackByInput = (input: ReturnUrlRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/v1/payments/vnpay-return',
      params: { vnp_TmnCode: input.vnp_TmnCode, vnp_Amount: input.vnp_Amount, vnp_BankCode: input.vnp_BankCode, vnp_BankTranNo: input.vnp_BankTranNo, vnp_CardType: input.vnp_CardType, vnp_PayDate: input.vnp_PayDate, vnp_OrderInfo: input.vnp_OrderInfo, vnp_TransactionNo: input.vnp_TransactionNo, vnp_ResponseCode: input.vnp_ResponseCode, vnp_TransactionStatus: input.vnp_TransactionStatus, vnp_TxnRef: input.vnp_TxnRef, vnp_SecureHashType: input.vnp_SecureHashType, vnp_SecureHash: input.vnp_SecureHash },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
