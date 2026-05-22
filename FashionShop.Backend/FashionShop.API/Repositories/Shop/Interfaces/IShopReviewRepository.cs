using FashionShop.Core.Contracts.Shop.Review.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopReviewRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopReviewResponse>> GetReviewsAsync(string productSlug);



        // --- VALIDATE METHODS --- //

        Task<bool> IsExistReview(Guid userId, Guid productId, int orderItemId);



        // --- WRITE METHODS --- //

        void CreateReview(Review review);
        void DeleteReview(Review review);
        void CreateReviewImage(ReviewImage reviewImage);
        void DeleteReviewImage(ReviewImage reviewImage);
    }
}
