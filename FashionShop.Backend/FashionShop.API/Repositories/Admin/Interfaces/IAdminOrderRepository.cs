using FashionShop.Core.Contracts.Admin.Order.Requests;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminOrderRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminOrderResponse>> GetOrdersAsync(AdminOrderListRequest request);
        Task<Order?> FindOrderByIdAsync(Guid orderId);
        Task<AdminOrderResponse?> GetOrderByIdAsync(Guid orderId);
    }
}
