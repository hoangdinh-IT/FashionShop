export interface Size {
    id: number;
    name: string;
    sortOrder: number;
    type: SizeType;
    productCount: number;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export const SizeType = {
    Clothing: "Clothing",
    Footwear: "Footwear",
    Accessory: "Accessory",
} as const;

export type SizeType = typeof SizeType[keyof typeof SizeType];