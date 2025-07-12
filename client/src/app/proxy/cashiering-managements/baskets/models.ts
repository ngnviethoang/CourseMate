
export interface BasketDto {
  items: BasketItemDto[];
  totalBill: number;
  discount: number;
  totalAmount: number;
  totalItems: number;
}

export interface BasketItemDto {
  courseId?: string;
  timeCreated?: string;
  name?: string;
  thumbnail?: string;
  price: number;
  description?: string;
  categoryName?: string;
  authorName?: string;
  totalChapter: number;
  duration?: string;
  totalVote: number;
  discount: number;
  sortNumber: number;
}
