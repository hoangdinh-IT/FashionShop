export interface Category {
    id: string;
    name: string;
    description: string;
    parentId: string;
    slug: string;
    productCount: number;
    imageUrl: string;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}