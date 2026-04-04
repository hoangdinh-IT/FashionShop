using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IBrandRepository
    {

        // --- READ METHODS --- //

        Task<bool> CheckExistSlugAsync(string slug);
        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request);
        Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId);
        Task<Brand?> FindBrandByIdAsync(Guid brandId);



        // --- VALIDATION METHODS --- //

        Task<bool> IsSafeToActionAsync(Guid brandId);



        // --- WRITE METHODS --- //

        Task<Brand?> CreateBrandAsync(Brand brand);
        Task<Brand?> UpdateBrandAsync(Brand brand);
        Task DeleteBrandAsync(Brand brand);
    }
}
