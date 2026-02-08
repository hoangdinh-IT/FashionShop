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