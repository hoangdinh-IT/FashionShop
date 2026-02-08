using FashionShop.Core.DTOs.Brand;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Brands;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IBrandRepository
    {
        Task<bool> CheckExistSlugAsync(string slug);
        Task<Brand?> CreateBrandAsync(Brand brand);
        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<PagedResult<BrandDTO>> GetPagedBrandsAsync(BrandListRequest request);
        Task<BrandDTO?> GetBrandByIdAsync(Guid brandId);
        Task<Brand?> FindBrandByIdAsync(Guid brandId);
        Task<Brand?> UpdateBrandAsync(Brand brand);
        Task<bool> IsSafeToActionAsync(Guid brandId);
        Task DeleteBrandAsync(Brand brand);
    }
}
