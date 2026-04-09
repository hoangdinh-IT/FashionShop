using FashionShop.Core.Contracts.Shop.Brand.Responses;
using FashionShop.Core.Contracts.Shop.Category.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopBrandService
    {
        Task<IEnumerable<ShopBrandResponse>> GetAllBrandsAsync();
        Task<IEnumerable<ShopCategoryResponse>> GetCategoriesByBrandAsync(Guid brandId);
    }
}
