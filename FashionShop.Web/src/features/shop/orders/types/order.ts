export interface Order {
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
    ShippingTrackingCode?: string;
    paymentDate?: Date;
    orderItems: OrderItem[];
}

interface OrderItem {
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

export interface RepurchaseOrderItem {
    productVariantId: string;
    productName: string;
    productSlug: string;
    variantName: string;
    stockQuantity: number;
    brandName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    totalLine: number;
}