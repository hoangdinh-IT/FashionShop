export interface PagingBase {
    pageSize: number;
    pageIndex: number;
    sortBy: string;
    isAscending: boolean;
}