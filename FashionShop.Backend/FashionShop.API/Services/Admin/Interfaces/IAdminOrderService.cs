using FashionShop.Core.Contracts.Admin.Order.Requests;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminOrderService
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminOrderSummaryResponse>> GetOrdersAsync(AdminOrderListRequest request);
        Task<AdminOrderDetailResponse?> GetOrderByIdAsync(Guid orderId);



        // --- WRITE METHODS --- //

        Task<AdminOrderDetailResponse?> UpdateOrderAsync(Guid orderId, UpdateOrderRequest request);
    }
}
