
export interface ReturnUrlDto {
  vnp_TmnCode?: string;
  vnp_Amount: number;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_PayDate: number;
  vnp_OrderInfo?: string;
  vnp_TransactionNo: number;
  vnp_ResponseCode: number;
  vnp_TransactionStatus: number;
  vnp_TxnRef?: string;
  vnp_SecureHashType?: string;
  vnp_SecureHash?: string;
}

export interface VnPayResponseDto {
  rspCode?: string;
  message?: string;
}
