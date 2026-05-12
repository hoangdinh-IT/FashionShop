using FashionShop.Core.Contracts.Shop.Order.Requests;
using FashionShop.Core.Contracts.Shop.Order.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopOrderService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopOrderSummaryResponse?>> GetOrdersAsync(Guid userId);
        Task<ShopOrderDetailResponse?> GetOrderByIdAsync(Guid userId, Guid orderId);



        // --- WRITE METHODS --- //

        Task<ShopOrderDetailResponse?> CreateOrderAsync(Guid userId, ShopCreateOrderRequest request);
        Task<ShopOrderDetailResponse?> UpdateCancelledAsync(Guid userId, Guid orderId);
    }
}
