using FashionShop.Core.Contracts.Brand.Requests;
using FashionShop.Core.Contracts.Brand.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Brand;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface IBrandService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<BrandResponse>> GetAllBrandsAsync();
        Task<PagedResult<BrandResponse>> GetPagedBrandsAsync(BrandListRequest request);
        Task<BrandResponse?> GetBrandByIdAsync(Guid brandId);



        // --- WRITE METHODS --- //

        Task<BrandResponse?> CreateBrandAsync(CreateBrandRequest dto);
        Task<BrandResponse?> UpdateBrandAsync(Guid brandId, UpdateBrandRequest dto);
        Task DeleteBrandAsync(Guid brandId);
    }
}
