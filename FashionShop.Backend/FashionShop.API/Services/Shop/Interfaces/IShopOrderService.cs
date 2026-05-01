using FashionShop.Core.Contracts.Shop.Order.Requests;
using FashionShop.Core.Contracts.Shop.Order.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopOrderService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopOrderResponse?>> GetOrdersAsync(Guid userId);
        Task<ShopOrderResponse?> GetOrderByIdAsync(Guid userId, Guid orderId);



        // --- WRITE METHODS --- //

        Task<ShopOrderResponse?> CreateOrderAsync(Guid userId, ShopCreateOrderRequest request);
    }
}
