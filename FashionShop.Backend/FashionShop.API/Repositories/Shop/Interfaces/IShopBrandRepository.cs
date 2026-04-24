using FashionShop.Core.Contracts.Shop.Brand.Responses;
using FashionShop.Core.Contracts.Shop.Category.Responses;
using FashionShop.Core.Contracts.Shop.Product.Responses;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopBrandRepository
    {
        Task<IEnumerable<ShopBrandResponse>> GetAllBrandsAsync();
        Task<IEnumerable<ShopCategoryResponse>> GetCategoriesByBrandAsync(Guid brandId);
        //Task<IEnumerable<ProductGridItemResponse>> GetProductsAsync(Guid? brandId, Guid? categoryId);
    }
}
