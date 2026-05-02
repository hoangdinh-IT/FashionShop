interface OrderDetail {
    id: number;
    productVariantId: string;
    productName: string;
    variantName: string;
    imageUrl?: string;
    unitPrice: number;
    quantity: number;
    totalLine: number;
    isReviewed: boolean;
}

export interface Order {
    id: string;
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
    ShippingTrackingCode?: string;
    paymentDate?: Date;
    orderDetails: OrderDetail[];
}