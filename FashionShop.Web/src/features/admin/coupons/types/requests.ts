import type { PagingBase } from "../../../../models/PagingBase";
import type { DiscountType } from "./coupon";

export interface CouponFormInputs {
    name: string;
    code: string;
    description: string;
    discountType: DiscountType;
    discountAmount: number;
    maxDiscountAmount?: number;
    minOrderValue: number;
    quantity: number;
    maxUsagePerUser: number;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
}

export interface CouponFilters {
    keyword?: string;
    discountType?: DiscountType;
    isActive?: boolean;
    fromDate?: Date;
    toDate?: Date;
    status?: string;
    isAvailable?: boolean;
    fromMinOrderValue?: number;
    toMinOrderValue?: number;
}

export interface CouponQueryParam extends CouponFilters, PagingBase {}