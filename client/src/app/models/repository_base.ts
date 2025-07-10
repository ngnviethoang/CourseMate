export interface RepositoryModel<T> {
    partnerCode?: string | null;
    retCode: string | number | null;
    data?: T | null;
    statusCode: number;
    systemMessage?: string | null;
}
