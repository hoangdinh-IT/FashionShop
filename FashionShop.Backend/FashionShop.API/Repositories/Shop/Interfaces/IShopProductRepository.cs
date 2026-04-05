using FashionShop.API.Data;
using FashionShop.Core.Contracts.Shop.Product.Requests;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopProductRepository
    {
        Task<PagedResult<IEnumerable<ShopProductResponse>>> GetPagedProductsAsync(ShopProductListRequest request);
    }
}
