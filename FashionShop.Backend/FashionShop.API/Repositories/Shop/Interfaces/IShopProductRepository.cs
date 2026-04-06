using FashionShop.API.Data;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopProductRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<ShopProductResponse>> GetPagedProductsAsync(ShopProductListRequest request);
        Task<ShopProductResponse?> GetProductByIdAsync(Guid productId);



        // --- WRITE METHODS --- //
    }
}
