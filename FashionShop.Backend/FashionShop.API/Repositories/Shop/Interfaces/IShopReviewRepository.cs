using FashionShop.Core.Contracts.Shop.Review.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopReviewRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopReviewResponse>> GetReviewsAsync(Guid? currentUserId, string productSlug);
        Task<Review?> FindReviewAsync(Guid reviewId);
        Task<ShopReviewResponse?> GetReviewAsync(Guid? currentUserId, Guid reviewId);



        // --- VALIDATE METHODS --- //

        Task<bool> IsExistReviewAsync(Guid userId, Guid productId, int orderItemId);
        Task<bool> IsReviewAuthorAsync(Guid userId, Guid reviewId);
        Task<bool> IsReviewLikedAsync(Guid userId, Guid reviewId);



        // --- WRITE METHODS --- //

        void CreateReview(Review review);
        void DeleteReview(Review review);
        void CreateReviewImage(ReviewImage reviewImage);
        void DeleteReviewImage(ReviewImage reviewImage);
    }
}
