using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Order.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/orders")]
    public class AdminOrdersController : AdminBaseApiControllers
    {
        private readonly IAdminOrderService _orderService;

        public AdminOrdersController(IAdminOrderService orderService)
        {
            _orderService = orderService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] AdminOrderListRequest request) 
        {
            var result = await _orderService.GetOrdersAsync(request);
            return Success(result, "Lấy danh sách đơn hàng thành công!");
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            var result = await _orderService.GetOrderByIdAsync(orderId);
            return Success(result, "Lấy đơn hàng thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPut("{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(Guid orderId, UpdateOrderRequest request)
        {
            var result = await _orderService.UpdateOrderAsync(orderId, request);
            return Success(result, "Cập nhật trạng thái đơn hàng thành công!");
        }
    }
}
