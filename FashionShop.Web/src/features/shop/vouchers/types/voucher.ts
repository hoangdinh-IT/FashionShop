export interface Voucher {
    id: string;
    name: string;
    code: string;
    description: string;
    discountType: DiscountType;
    discountAmount: number;
    maxDiscountAmount?: number | null;
    minOrderValue: number;
    quantity: number;
    usedCount: number;
    maxUsagePerUser: number;
    startDate: string;
    endDate: string;
}

export const DiscountType = {
    FixedAmount: "FixedAmount",
    Percentage: "Percentage",
} as const;

export type DiscountType = typeof DiscountType[keyof typeof DiscountType];