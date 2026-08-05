export interface Product {
    id: string;
    categoryId: string;
    brandId: string;
    categoryName: string;
    brandName: string;
    name: string;
    slug: string;
    description: string;
    material: string;
    originalPrice: number;
    discountPercent: number;
    finalPrice: number;
    thumbnailUrl: string;
    isActive: boolean;
    isBestSeller: boolean;
    isNew: boolean;
    viewCount: number;
    createdDate: Date;
    updatedDate: Date;
}

export interface ProductVariant {
    id: string;
    productId: string;
    colorId: string;
    sizeId: string;
    sku: string;
    stockQuantity: number;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export interface ProductDetail extends Product {
    productVariants: ProductVariant[];
}

export interface ProductImage {
    id: string;
    productId: string;
    colorId: number | null;
    colorName: string;
    colorHexCode: string;
    imageUrl: string;
    sortOrder: number;
}