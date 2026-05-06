using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopProductService
    {

        // --- READ METHODS --- //

        Task<PagedResult<ProductGridItemResponse>> GetPagedProductsAsync(ShopProductListRequest request);
        Task<IEnumerable<ProductGridItemResponse>> GetCollectionProductsAsync(ShopCollectionProductListRequest request);
        Task<ShopProductDetailResponse?> GetProductBySlugAsync(string productSlug);
        Task<ShopFilterOptionsResponse?> GetFilterOptionsAsync(ShopFilterOptionsRequest request);
    }
}
