using FashionShop.API.Extensions;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Order.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Shop
{
    [Route("api/shop/orders")]
    public class ShopOrdersController : ShopBaseApiController
    {
        private readonly IShopOrderService _orderService;

        public ShopOrdersController(IShopOrderService orderService)
        {
            _orderService = orderService;
        }

        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _orderService.GetOrdersAsync(userId);
            return Success(result, "Lấy danh sách đơn hàng thành công!");
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _orderService.GetOrderByIdAsync(userId, orderId);
            return Success(result, "Lấy đơn hàng thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateOrder(ShopCreateOrderRequest request)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _orderService.CreateOrderAsync(userId, request);
            return Success(result, "Tạo đơn hàng thành công!");
        }

        [HttpPut("{orderId}/order-status-cancelled")]
        public async Task<IActionResult> UpdateCancelled(Guid orderId)
        {
            Guid userId = User.GetUserId();

            if (userId == Guid.Empty)
            {
                throw new ArgumentException("ID không hợp lệ!");
            }

            var result = await _orderService.UpdateCancelledAsync(userId, orderId);
            return Success(result, "Đơn hàng huỷ thành công!");
        }
    }
}
