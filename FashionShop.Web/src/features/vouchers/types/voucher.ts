export interface Voucher {
    id: string;
    name: string;
    code: string;
    description: string;
    discountType: DiscountType;
    discountAmount: number;
    maxDiscountAmount?: number;
    minOrderValue: number;
    quantity: number;
    usedCount: number;
    maxUsagePerUser: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export const DiscountType = {
    FixedAmount: "FixedAmount",
    Percentage: "Percentage",
} as const;

export type DiscountType = typeof DiscountType[keyof typeof DiscountType];