export interface OrderSummary {
    orderId: string;
    orderDate: Date;
    shippingAddress: string;
    shippingCommune: string;
    shippingDistrict: string;
    shippingCity: string;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    subTotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    note?: string;
    shippingTrackingCode?: string;
    paymentDate?: Date;
    orderItems: OrderItemSummary[];
}

interface OrderItemSummary {
    orderItemId: number;
    productVariantId: string;
    productName: string;
    productSlug: string;
    variantName: string;
    brandName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    totalLine: number;
    isReviewed: boolean;
}

export interface OrderDetail {
    orderId: string;
    orderDate: Date;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    shippingCommune: string;
    shippingDistrict: string;
    shippingCity: string;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    subTotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    note?: string;
    shippingTrackingCode?: string;
    paymentDate?: Date;
    orderItems: OrderItemDetail[];
}

interface OrderItemDetail {
    orderItemId: number;
    productVariantId: string;
    productName: string;
    variantName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    totalLine: number;
    isReviewed: boolean;
}