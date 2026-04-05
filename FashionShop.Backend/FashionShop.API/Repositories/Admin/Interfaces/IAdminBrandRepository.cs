using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminBrandRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<Brand>> GetAllBrandsAsync();
        Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request);
        Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId);
        Task<Brand?> FindBrandByIdAsync(Guid brandId);



        // --- VALIDATION METHODS --- //

        Task<bool> IsSafeToActionAsync(Guid brandId);
        Task<bool> CheckExistSlugAsync(string slug);



        // --- WRITE METHODS --- //

        void CreateBrand(Brand brand);
        void DeleteBrand(Brand brand);
    }
}
