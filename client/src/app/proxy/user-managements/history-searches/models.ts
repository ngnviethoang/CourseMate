
export interface CreateHistorySearchDto extends HistorySearchDto {
}

export interface HistorySearchDto {
  id?: string;
  userId?: string;
  text?: string;
  timeCreated?: string;
}

export interface UpdateHistorySearchDto extends HistorySearchDto {
}
