using FashionShop.Core.Contracts.Shop.Review.Requests;
using FashionShop.Core.Contracts.Shop.Review.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopReviewService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopReviewResponse?>> GetReviewsAsync(Guid? currentUserId, string productSlug);



        // --- WRITE METHODS --- //

        Task<ShopReviewResponse?> CreateReviewAsync(Guid userId, ShopCreateReviewRequest request);
    }
}
