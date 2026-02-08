using FashionShop.Core.DTOs.Brand;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Brands;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface IBrandService
    {
        Task<BrandDTO?> CreateBrandAsync(CreateBrandDTO dto);
        Task<IEnumerable<BrandDTO>> GetAllBrandsAsync();
        Task<PagedResult<BrandDTO>> GetPagedBrandsAsync(BrandListRequest request);
        Task<BrandDTO?> GetBrandByIdAsync(Guid brandId);
        Task<BrandDTO?> UpdateBrandAsync(Guid brandId, UpdateBrandDTO dto);
        Task DeleteBrandAsync(Guid brandId);
    }
}
