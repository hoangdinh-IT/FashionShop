export interface Brand {
    id: string;
    name: string;
    description: string;
    slug: string;
    productCount: number;
    logoUrl: string;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}