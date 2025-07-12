import type { OrderStatus } from '../../shared/order-status.enum';
import type { OrderDetailDto } from '../order-details/models';

export interface CreateOrderDto {
  courseIds: string[];
}

export interface OrderDto {
  id?: string;
  orderDate?: string;
  orderNo: number;
  paymentRequestId?: string;
  status?: OrderStatus;
  items: OrderDetailDto[];
}

export interface UpdateOrderDto {
  id?: string;
  courseIds: string[];
}
