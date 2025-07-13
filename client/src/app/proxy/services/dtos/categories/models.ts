import type { AuditedEntityDto } from '@abp/ng.core';

export interface CategoryDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
}

export interface CreateUpdateCategoryDto {
  name: string;
  description?: string;
}
