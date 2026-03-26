import type { PagingBase } from "../../../models/PagingBase";

// -- PRODUCTS -- //

// export interface ProductFormInputs {
//     name: string;
//     slug: string;
//     description: string;
//     content: string;
//     material: string;
//     price: number;
//     thumbnail: File;

//     categoryId: string;
//     brandId: string;

//     isActive?: boolean;
//     isBestSeller?: boolean;
//     isNew?: boolean;
// }

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
    content: string;
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
        quantity: number;
        price: number;
    }[];
}


// -- PRODUCT-VARIANTS -- //

export interface ProductVariantFormInputs {
    SKU: string;
    quantity: number;
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