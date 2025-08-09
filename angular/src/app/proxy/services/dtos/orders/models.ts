import type { AuditedEntityDto, EntityDto } from '@abp/ng.core';
import type { CourseDto } from '../courses/models';

export interface CreateUpdateOrderDto {
  courseIds: string[];
}

export interface OrderDto extends AuditedEntityDto<string> {
  studentId?: string;
  totalAmount: number;
  currency?: string;
  description?: string;
  items: OrderItemDto[];
}

export interface OrderItemDto extends EntityDto<string> {
  orderId?: string;
  courseId?: string;
  price: number;
  course: CourseDto;
}
