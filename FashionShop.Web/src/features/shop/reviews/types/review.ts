interface ReviewImage {
    reviewImageId: string;
    imageUrl: string;
    sortOrder: string;
}

export interface Review {
    reviewId: string;
    userId: string;
    fullname: string;
    avatar?: string;
    productId: string;
    orderItemId: string;
    rating: number;
    content?: string;
    likeCount: number;
    reviewImages: ReviewImage[];
    createDate: Date;
}