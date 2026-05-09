export interface Cart {
    id: string;
    userId: string;
    cartItems: CartItem[];
}

export interface CartItem {
    id: number;
    cartId: string;
    productVariantId: string;
    quantity: number;
    isSelected: boolean;
    
    productId: string;
    productName: string;
    productSlug: string;
    brandName: string;
    imageUrl: string;

    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    
    unitPrice: number;
    createDate: Date;
    updatedDate: Date;
}