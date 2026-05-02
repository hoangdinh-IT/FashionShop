import type { PagingBase } from "../../../../models/PagingBase";

export interface OrderFilters {
    keyword?: string;
    orderStatus?: OrderStatus;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
    fromOrderDate?: Date;
    toOrderDate?: Date;
}

export interface OrderQueryParams extends OrderFilters, PagingBase {}

export interface UpdateOrder {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
}



export const OrderStatus = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Shipping: "Shipping",
    Success: "Success",
    Cancelled: "Cancelled",
    Failed: "Failed",
    Returned: "Returned",
    Refunded: "Refunded",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PaymentMethod = {
    COD: "COD",
    Banking: "Banking",
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
    Unpaid: "Unpaid",
    Paid: "Paid",
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];