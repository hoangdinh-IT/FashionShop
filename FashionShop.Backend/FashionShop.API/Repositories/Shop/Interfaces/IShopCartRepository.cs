using FashionShop.Core.Contracts.Shop.Cart.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopCartRepository
    {

        // --- READ METHODS --- //

        Task<Cart?> GetCartAsync(Guid userId);
        Task<CartItem?> GetCartItemAsync(Guid userId, int cartItemId);
        Task<IEnumerable<ShopCartItemResponse>> GetCartItemsAsync(Guid userId);
        Task<CartItem?> GetCartItemWithVariantAsync(Guid userId, int cartItemId, Guid productVariantId);



        // --- VALIDATE METHODS --- //


        // --- WRITE METHODS --- //

        void CreateCart(Cart cart);
        void DeleteCartItem(CartItem cartItem);
    }
}
