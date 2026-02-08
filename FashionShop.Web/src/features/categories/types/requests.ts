import type { PagingBase } from "../../../models/PagingBase";

export interface CategoryFormInputs {
    name: string;
    description?: string;
    parentId?: string;
    slug: string;
    isActive?: boolean;
}

export interface CategoryFilters {
    keyword?: string;
    isActive?: boolean;
    parentId?: string; 
}

export interface CategoryQueryParams extends CategoryFilters, PagingBase {}