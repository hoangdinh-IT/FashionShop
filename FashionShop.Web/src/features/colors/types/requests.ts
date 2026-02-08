import type { PagingBase } from "../../../models/PagingBase";

export interface ColorFormInputs {
    name: string;
    hexCode: string;
    slug: string;
    isActive?: boolean;
}

export interface ColorFilters {
    keyword?: string;
    isActive?: boolean;
}

export interface ColorQueryParams extends ColorFilters, PagingBase {}