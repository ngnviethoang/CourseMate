import type { EntityDto } from '@abp/ng.core';

export interface CategoryDto {
  id?: string;
  name?: string;
  code?: string;
  note?: string;
}

export interface CreateCategoryDto extends EntityDto {
  name?: string;
  code?: string;
  note?: string;
}

export interface UpdateCategoryDto extends CategoryDto {
}
