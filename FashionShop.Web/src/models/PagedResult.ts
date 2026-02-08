export interface PagedResult<T> {
    items: T[];
    totalRecord: number;
    pageSize: number;
    pageIndex: number;
}