using FashionShop.API.Data;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopProductRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<ProductGridItemResponse>> GetPagedProductsAsync(ShopProductListRequest request);
        Task<ProductVariant?> FindProductVariantByIdAsync(Guid productVariantId);
        Task<ProductDetailResponse?> GetProductBySlugAsync(string productSlug);
        Task<ShopFilterOptionsResponse?> GetFilterOptionsAsync(ShopFilterOptionsRequest request);



        // --- WRITE METHODS --- //
    }
}
