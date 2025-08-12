import type { RatingType } from '../../../entities/reviews/rating-type.enum';

export interface CreateUpdateReviewDto {
  studentId?: string;
  courseId?: string;
  rating?: RatingType;
  comment?: string;
}

export interface ReviewDto {
}
