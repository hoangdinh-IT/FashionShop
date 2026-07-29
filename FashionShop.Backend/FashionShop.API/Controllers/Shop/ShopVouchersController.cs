using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/vouchers")]
    public class ShopVouchersController : ShopBaseApiController
    {
        private readonly IShopVoucherService _voucherService;

        public ShopVouchersController(IShopVoucherService voucherService)
        {
            _voucherService = voucherService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetVouchers()
        {
            Guid userId = User.GetUserId();
            if (userId == Guid.Empty) throw new ArgumentException("ID không hợp lệ!");

            var result = await _voucherService.GetVouchersAsync(userId);
            return Success(result, "Lấy danh sách voucher thành công!");
        }
    }
}
