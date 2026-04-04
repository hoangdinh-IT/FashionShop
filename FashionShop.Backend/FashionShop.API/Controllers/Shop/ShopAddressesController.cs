using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Address.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/addresses")]
    public class ShopAddressesController : ShopBaseApiController
    {
        private readonly IShopAddressService _addressService;

        public ShopAddressesController(IShopAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress(CreateAddressRequest request)
        {
            request.UserId = User.GetUserId();
            var result = await _addressService.CreateAddressAsync(request);
            return Created(result, "Thêm địa chỉ giao hàng thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetAddressesByUserId()
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _addressService.GetAddressesByUserIdAsync(userId);
            return Success(result, "Lấy danh sách địa chỉ giao hàng thành công!");
        }

        [HttpPut("{addressId}")]
        public async Task<IActionResult> UpdateAddressByUserId(Guid addressId, UpdateAddressRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty || addressId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _addressService.UpdateAddressByUserIdAsync(userId, addressId, request);
            return Success(result, "Cập nhật địa chỉ giao hàng thành công!");
        }

        [HttpDelete("{addressId}")]
        public async Task<IActionResult> DeleteAddress(Guid addressId)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty || addressId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            await _addressService.DeleteAddressAsync(userId, addressId);
            return Success<object?>(null, "Xoá địa chỉ giao hàng thành công!");
        }
    }
}
