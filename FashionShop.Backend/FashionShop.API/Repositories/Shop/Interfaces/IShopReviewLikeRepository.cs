using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopReviewLikeRepository
    {

        // --- READ METHODS --- //

        Task<ReviewLike?> FindReviewLikeAsync(Guid userId, Guid reviewId);
        Task<int> TotalLikesAsync(Guid reviewId);



        // --- VALIDATE METHODS --- //

        Task<bool> IsReviewAuthorAsync(Guid userId, Guid reviewId);



        // --- WRITE METHODS --- //
        void CreateReviewLike(ReviewLike reviewLike);
    }
}
