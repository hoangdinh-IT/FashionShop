using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopOrderRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopOrderResponse?>> GetOrdersAsync(Guid userId);
        Task<ShopOrderResponse?> GetOrderByIdAsync(Guid userId, Guid orderId);



        // --- WRITE METHODS --- //

        void Create(Order order);
    }
}
