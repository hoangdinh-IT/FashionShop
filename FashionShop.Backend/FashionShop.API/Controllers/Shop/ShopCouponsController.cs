using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/Coupons")]
    public class ShopCouponsController : ShopBaseApiController
    {
        private readonly IShopCouponService _couponService;

        public ShopCouponsController(IShopCouponService CouponService)
        {
            _couponService = CouponService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetCoupons()
        {
            Guid userId = User.GetUserId();
            if (userId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _couponService.GetCouponsAsync(userId);
            return Success(result, "Lấy danh sách Coupon thành công!");
        }
    }
}
