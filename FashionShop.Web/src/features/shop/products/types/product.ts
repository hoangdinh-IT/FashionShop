import type { Color } from "../../colors/types/color";
import type { Size } from "../../sizes/types/size";

interface ProductColor {
    colorId: number;
    colorName: string;
    colorHexCode: string;
    imageUrl?: string;
}

interface ProductSize {
    sizeId: number;
    sizeName: string;
}

interface ProductVariant {
    productVariantId: string;
    colorId: number;
    sizeId: number;
    quantity: number;
}

interface ProductImage {
    imageId: string;
    productId: string;
    colorId: number;
    imageUrl: string;
    sortOrder: number;
}

export interface ProductGridItem {
    productId: string;
    name: string;
    slug: string;
    price: number;
    thumbnailUrl: string;
    isNew: boolean;
    isBestSeller: boolean;
    productColors: ProductColor[],
    productSizes: ProductSize[],
    productVariants: ProductVariant[],
}

export interface FilterOptionsResponse {
    availableColors: Color[];
    availableSizes: Size[];
    brandName: string;
    categoryName: string;
}

export interface ProductDetail {
    productId: string;
    name: string;
    slug: string;
    content: string;
    material: string;
    price: number;
    thumbnailUrl: string;
    isNew: boolean;
    isBestSeller: boolean;
    productColors: ProductColor[],
    productSizes: ProductSize[],
    productVariants: ProductVariant[],
    productImages: ProductImage[],
}