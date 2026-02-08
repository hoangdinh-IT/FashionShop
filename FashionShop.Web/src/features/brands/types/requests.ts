import type { PagingBase } from "../../../models/PagingBase";

export interface BrandFormInputs {
    name: string;
    description?: string;
    slug: string;
    logo: File;
    isActive?: boolean
}

export interface BrandFilters {
    keyword?: string;
    isActive?: boolean;
}

export interface BrandQueryParams extends BrandFilters, PagingBase {}