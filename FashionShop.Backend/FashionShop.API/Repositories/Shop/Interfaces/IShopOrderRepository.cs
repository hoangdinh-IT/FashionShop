using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopOrderRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopOrderSummaryResponse?>> GetOrdersAsync(Guid userId);
        Task<Order?> FindOrderByIdAsync(Guid userId, Guid orderId);
        Task<ShopOrderDetailResponse?> GetOrderByIdAsync(Guid userId, Guid orderId);



        // --- WRITE METHODS --- //

        void Create(Order order);
    }
}
