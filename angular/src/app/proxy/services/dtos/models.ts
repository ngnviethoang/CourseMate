
export interface GetListRequestDto {
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
  filter?: string;
}

export interface ResultObjectDto {
  id?: string;
}
