import type { EntityDto } from '@abp/ng.core';

export interface CreateTestCaseDto extends EntityDto {
  exerciseId?: string;
  input?: string;
  expected?: string;
  output?: string;
  passed: boolean;
}

export interface TestCaseDto extends EntityDto {
  id?: string;
  exerciseId?: string;
  input?: string;
  expected?: string;
  output?: string;
  passed: boolean;
}

export interface UpdateTestCase extends TestCaseDto {
}
