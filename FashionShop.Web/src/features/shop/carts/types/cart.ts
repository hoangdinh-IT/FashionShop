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
    imageUrl: string;

    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    
    price: number;
    createDate: Date;
    updatedDate: Date;
}