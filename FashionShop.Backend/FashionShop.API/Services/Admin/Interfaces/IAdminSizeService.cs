using FashionShop.Core.Contracts.Admin.Size.Requests;
using FashionShop.Core.Contracts.Admin.Size.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminSizeService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminSizeResponse>> GetAllSizesAsync();
        Task<PagedResult<AdminSizeResponse>> GetPagedSizesAsync(AdminSizeListRequest request);
        Task<AdminSizeResponse?> GetSizeByIdAsync(int sizeId);



        // --- WRITE METHODS --- //

        Task<AdminSizeResponse?> CreateSizeAsync(AdminCreateSizeRequest dto);
        Task<AdminSizeResponse?> UpdateSizeAsync(int sizeId, AdminUpdateSizeRequest dto);
        Task DeleteSizeAsync(int sizeId);
    }
}
