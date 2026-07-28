using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.ReviewLike.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/review-likes")]
    public class ShopReviewLikesController : ShopBaseApiController
    {
        private readonly IShopReviewLikeService _reviewLikeService;

        public ShopReviewLikesController(IShopReviewLikeService reviewLikeService)
        {
            _reviewLikeService = reviewLikeService;
        }

        // --- READ METHODS --- //



        // --- WRITE METHODS --- //

        [HttpPut]
        public async Task<IActionResult> UpdateReviewLike([FromBody] ShopUpdateReviewLikeRequest request)
        {
            Guid userId = User.GetUserId();
            if (userId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _reviewLikeService.UpdateReviewLikeAsync(userId, request);
            return Success(result, "Cập nhật tương tác đánh giá thành công!");
        }
    }
}
