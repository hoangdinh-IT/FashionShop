import type { PagingBase } from "../../../../models/PagingBase";

export interface ProductFilters {
    keyword?: string;
    categorySlug?: string;
    brandSlug?: string;
    colorId?: number;
    sizeIds?: number[];
    isBestSeller?: string;
    isNew?: string;
    priceRange?: string;
    isAscendingPrice?: boolean;
}

export interface ProductQueryParams extends ProductFilters, PagingBase {}

export interface FilterOptionsRequest {
    brandSlug?: string;
    categorySlug?: string;
}