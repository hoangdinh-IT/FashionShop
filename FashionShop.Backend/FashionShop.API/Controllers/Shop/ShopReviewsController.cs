using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Review.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/reviews")]
    public class ShopReviewsController : ShopBaseApiController
    {
        private readonly IShopReviewService _reviewService;

        public ShopReviewsController(IShopReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // --- READ METHODS --- //

        [HttpGet("{productSlug}")]
        public async Task<IActionResult> GetReviews(string productSlug)
        {
            var result = await _reviewService.GetReviewsAsync(productSlug);
            return Success(result, "Lấy danh sách đánh giá dựa vào sản phẩm thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromForm] ShopCreateReviewRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _reviewService.CreateReviewAsync(userId, request);
            return Created(result, "Thêm đánh giá thành công!");
        }
    }
}
