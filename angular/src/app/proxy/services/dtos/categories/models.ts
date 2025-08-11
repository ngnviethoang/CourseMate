import type { AuditedEntityDto } from '@abp/ng.core';

export interface CategoryDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  isActive: boolean;
}

export interface CreateUpdateCategoryDto {
  name: string;
  description?: string;
  isActive: boolean;
}
