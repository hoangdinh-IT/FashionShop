export interface ReviewFormInputs {
    productId: string;
    orderItemId: string;
    rating: number;
    content?: string;
    reviewImages?: File[];
}

export interface UpdateReviewLike {
    reviewId: string;
}