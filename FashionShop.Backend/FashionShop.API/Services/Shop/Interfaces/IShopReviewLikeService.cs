using FashionShop.Core.Contracts.Shop.ReviewLike.Requests;
using FashionShop.Core.Contracts.Shop.ReviewLike.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopReviewLikeService
    {

        // --- READ METHODS --- //



        // --- WRITE METHODS --- //
        Task<ShopReviewLikeResponse> UpdateReviewLikeAsync(Guid userId, ShopUpdateReviewLikeRequest request);
    }
}
