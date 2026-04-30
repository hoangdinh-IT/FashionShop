export interface CartFormInputs {
    productVariantId: string;
    quantity: number;
}

export interface UpdateCartItem {
    productVariantId: string;
    quantity: number;
    isSelected: boolean;
}