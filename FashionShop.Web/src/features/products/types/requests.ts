import type { GeneralStatus } from "../../../models/enums";
import type { PagingBase } from "../../../models/PagingBase";

export interface ProductFormInputs {
    name: string;
    slug: string;
    description: string;
    content: string;
    material: string;
    price: number;
    thumbnail: File;

    categoryId: string;
    brandId: string;

    isActive?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
}

export interface ProductFilters {
    keyword?: string;
    categoryId?: string; 
    brandId?: string; 
    isActive?: GeneralStatus;
    isBestSeller?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number; 
}

export interface ProductQueryParams extends ProductFilters, PagingBase {}