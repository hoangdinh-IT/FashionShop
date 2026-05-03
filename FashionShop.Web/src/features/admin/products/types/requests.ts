import type { PagingBase } from "../../../../models/PagingBase";

// -- PRODUCTS -- //

export interface ProductFormInputs {
    name: string;
    slug: string;
    description: string;
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
    isActive?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number; 
}

export interface ProductQueryParams extends ProductFilters, PagingBase {}


// -- PRODUCT-DETAIL -- //

export interface ProductDetailFormInputs {
    name: string;
    slug: string;
    description: string;
    material: string;
    price: number;
    thumbnail: File;

    categoryId: string;
    brandId: string;

    isActive?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;

    productVariants: {
        id: string;
        sku: string;
        colorId: number;
        sizeId: number;
        stockQuantity: number;
        price: number;
    }[];
}


// -- PRODUCT-VARIANTS -- //

export interface ProductVariantFormInputs {
    sku: string;
    stockQuantity: number;
    price: number;

    productId: string;
    colorId: string;
    sizeId: string;
}

export interface ProductVariantFilters {
    keyword?: string;
    productId?: string;
    colorId?: string;
    sizeId?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface ProductVariantQueryParams extends ProductVariantFilters, PagingBase {}


// -- PRODUCT-IMAGES -- //

export interface UpdateSortOrderRequest {
    colorId?: number;
    imageIds: string[];
}

export interface DeleteProductImagesRequest {
    imageIds?: string[];
}