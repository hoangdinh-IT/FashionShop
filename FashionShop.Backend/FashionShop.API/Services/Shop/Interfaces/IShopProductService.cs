using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopProductService
    {

        // --- READ METHODS --- //

        Task<PagedResult<ShopProductResponse>> GetPagedProductsAsync(ShopProductListRequest request);
        Task<ShopProductResponse?> GetProductByIdAsync(Guid productId);
    }
}
