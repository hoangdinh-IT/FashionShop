using FashionShop.Core.Contracts.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Brands;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IBrandRepository
    {
        // --- READ METHODS --- //
        Task<bool> CheckExistSlugAsync(string slug);
        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<PagedResult<BrandResponse>> GetPagedBrandsAsync(BrandListRequest request);
        Task<BrandResponse?> GetBrandByIdAsync(Guid brandId);
        Task<Brand?> FindBrandByIdAsync(Guid brandId);

        // --- VALIDATION METHODS --- //
        Task<bool> IsSafeToActionAsync(Guid brandId);

        // --- WRITE METHODS --- //
        Task<Brand?> CreateBrandAsync(Brand brand);
        Task<Brand?> UpdateBrandAsync(Brand brand);
        Task DeleteBrandAsync(Brand brand);
    }
}
