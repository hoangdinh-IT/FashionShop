import type { Color } from "../../colors/types/color";
import type { Size } from "../../sizes/types/size";

interface Product {
    productId: string;
    name: string;
    slug: string;
    price: number;
    thumbnailUrl: string;
    isBestSeller: boolean;
    isNew: boolean;
}

interface ProductColor {
    colorId: number;
    colorName: string;
    colorHexCode: string;
    imageUrl?: string;
}

interface ProductSize {
    sizeId: number;
    sizeName: string;
    isOutOfStock: boolean;
}

interface ProductVariant {
    colorId: number;
    sizeId: number;
    quantity: number;
}

export interface ProductGridItem extends Product {
    productColors: ProductColor[],
    productSizes: ProductSize[],
    productVariants: ProductVariant[],
}

export interface FilterOptionsResponse {
    availableColors: Color[];
    availableSizes: Size[];
}