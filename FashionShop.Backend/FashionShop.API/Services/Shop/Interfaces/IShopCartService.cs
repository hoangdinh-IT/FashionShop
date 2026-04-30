using FashionShop.Core.Contracts.Shop.Cart.Requests;
using FashionShop.Core.Contracts.Shop.Cart.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopCartService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopCartItemResponse>> GetCartItemsAsync(Guid userId);



        // --- WRITE METHODS --- //

        Task<ShopCartResponse> CreateCartItemAsync(Guid userId, ShopCreateCartItemRequest request);
        Task<ShopCartResponse> UpdateCartItemAsync(Guid userId, int cartItemId, ShopUpdateCartItemRequest request);
        Task DeleteCartItemAsync(Guid userId, int cartItemId);
    }
}
