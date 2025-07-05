
export interface CreateUpdateOrderDto {
  studentId?: string;
  totalAmount: number;
  currency?: string;
  paymentRequestId?: string;
  items: CreateUpdateOrderItemDto[];
}

export interface CreateUpdateOrderItemDto {
  orderId?: string;
  courseId?: string;
  price: number;
}

export interface OrderDto {
}
