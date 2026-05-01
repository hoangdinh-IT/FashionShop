interface OrderDetailRequest {
    productVariantId: string;
    quantity: number;
}

export interface OrderRequest {
    shippingAddress: string;
    shippingCommune: string;
    shippingDistrict: string;
    shippingCity: string;
    paymentMethod: PaymentMethod;
    voucherId?: string;
    note?: string;
    orderDetails: OrderDetailRequest[];
}

export const PaymentMethod = {
    COD: "COD",
    Banking: "Banking",
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];