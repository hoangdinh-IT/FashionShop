export interface Product {
    id: string;
    categoryId: string;
    brandId: string;
    categoryName: string;
    brandName: string;
    name: string;
    slug: string;
    description: string;
    content: string;
    material: string;
    price: number;
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
    quantity: number;
    price: number;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export interface ProductDetail extends Product {
    productVariants: ProductVariant[];
}