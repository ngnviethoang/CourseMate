
export interface LookupDto {
  id?: string;
  name?: string;
  creatorId?: string;
}

export interface LookupRequestDto {
  skipCount?: number;
  maxResultCount?: number;
  filter?: string;
}
