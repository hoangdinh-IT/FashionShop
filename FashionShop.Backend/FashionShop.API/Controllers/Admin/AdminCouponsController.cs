using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/Coupons")]
    public class AdminCouponsController : AdminBaseApiControllers
    {
        private readonly IAdminCouponService _CouponService;

        public AdminCouponsController(IAdminCouponService CouponService)
        {
            _CouponService = CouponService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetCoupons([FromQuery] AdminCouponListRequest request) 
        {
            var result = await _CouponService.GetPagedCoupons(request);
            return Success(result, "Lấy danh sách mã giảm giá thành công!");
        }

        [HttpGet("{CouponId}")]
        public async Task<IActionResult> GetCouponById(Guid CouponId)
        {
            var result = await _CouponService.GetCouponByIdAsync(CouponId);
            return Success(result, "Lấy mã giảm giá thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateCoupon(AdminCreateCouponRequest request)
        {
            var result = await _CouponService.CreateCouponAsync(request);
            return Created(result, "Thêm mới mã giảm giá thành công!");
        }

        [HttpPut("{CouponId}")]
        public async Task<IActionResult> UpdateCoupon(Guid CouponId, [FromBody] AdminUpdateCouponRequest request) 
        {
            var result = await _CouponService.UpdateCouponAsync(CouponId, request);
            return Success(result, "Cập nhật mã giảm giá thành công!");
        }

        [HttpDelete("{CouponId}")]
        public async Task<IActionResult> DeleteCoupon(Guid CouponId)
        {
            await _CouponService.DeleteCouponAsync(CouponId);
            return Success<object?>(null, "Xoá mã giảm giá thành công!");
        }
    }
}
