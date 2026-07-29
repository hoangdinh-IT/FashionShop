using FashionShop.Core.Contracts.Admin.Brand.Requests;
using FashionShop.Core.Contracts.Admin.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminBrandService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminBrandResponse>> GetAllBrandsAsync();
        Task<PagedResult<AdminBrandResponse>> GetPagedBrandsAsync(AdminBrandListRequest request);
        Task<AdminBrandResponse?> GetBrandByIdAsync(Guid brandId);



        // --- WRITE METHODS --- //

        Task<AdminBrandResponse?> CreateBrandAsync(AdminCreateBrandRequest dto);
        Task<AdminBrandResponse?> UpdateBrandAsync(Guid brandId, AdminUpdateBrandRequest dto);
        Task DeleteBrandAsync(Guid brandId);
    }
}
