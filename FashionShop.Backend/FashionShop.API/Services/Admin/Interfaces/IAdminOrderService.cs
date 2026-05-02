using FashionShop.Core.Contracts.Admin.Order.Requests;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminOrderService
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminOrderResponse>> GetOrdersAsync(AdminOrderListRequest request);
        Task<AdminOrderResponse?> GetOrderByIdAsync(Guid orderId);



        // --- WRITE METHODS --- //

        Task<AdminOrderResponse?> UpdateOrderAsync(Guid orderId, UpdateOrderRequest request);
    }
}
