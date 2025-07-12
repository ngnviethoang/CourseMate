import type { AppUserDto } from '../app-user/models';

export interface ReviewDto {
  title?: string;
  content?: string;
  rating: number;
  userId?: string;
  user: AppUserDto;
  courseId?: string;
  timeCreated?: string;
}
