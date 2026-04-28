import type { PagingBase } from "../../../../models/PagingBase";
import type { SizeType } from "./size";

export interface SizeFormInputs {
    name: string;
    slug: string;
    sortOrder: number;
    type: SizeType;
    isActive?: boolean;
}

export interface SizeFilters {
    keyword?: string;
    type?: SizeType;
    isActive?: boolean;
}

export interface SizeQueryParams extends SizeFilters, PagingBase {}