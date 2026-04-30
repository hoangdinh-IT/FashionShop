using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Cart.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/carts")]
    public class ShopCartsController : ShopBaseApiController
    {
        private readonly IShopCartService _cartService;

        public ShopCartsController(IShopCartService cartService)
        {
            _cartService = cartService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetCartItems()
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
                throw new ArgumentException("ID không hợp lệ!");

            var result = await _cartService.GetCartItemsAsync(userId);
            return Success(result, "Lấy danh sách sản phẩm trong giỏ hàng thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateCartItem([FromBody] ShopCreateCartItemRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
                throw new ArgumentException("ID không hợp lệ!");

            var result = await _cartService.CreateCartItemAsync(userId, request);
            return Success(result, "Thêm sản phẩm trong giỏ hàng thành công!");
        }

        [HttpPut("items/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, ShopUpdateCartItemRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
                throw new ArgumentException("ID không hợp lệ!");

            var result = await _cartService.UpdateCartItemAsync(userId, cartItemId, request);
            return Success(result, "Cập nhật biến thể sản phẩm thành công!");
        }

        [HttpDelete("items/{cartItemId}")]
        public async Task<IActionResult> DeleteCartItem(int cartItemId)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
                throw new ArgumentException("ID không hợp lệ!");

            await _cartService.DeleteCartItemAsync(userId, cartItemId);
            return Success<object?>(null, "Xoá sản phẩm trong giỏ hàng thành công!");
        }
    }
}
