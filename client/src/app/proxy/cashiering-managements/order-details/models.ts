
export interface OrderDetailDto {
  orderId?: string;
  courseId?: string;
  price: number;
  discount: number;
  courseName?: string;
  courseDescription?: string;
  courseAuthorId?: string;
  courseThumbnail?: string;
}
