import type { PagingBase } from "../../../../models/PagingBase";

export interface ProductFilters {
    keyword?: string;
    brandSlug?: string;
    categorySlug?: string;
    sizeSlugs?: string[];
    colorSlug?: string;
    isBestSeller?: boolean;
    isNew?: boolean;
    priceRange?: string[];
    isAscendingPrice?: boolean;
}

export interface ProductQueryParams extends ProductFilters, PagingBase {}

export interface FilterOptionsRequest {
    brandSlug?: string;
    categorySlug?: string;
}