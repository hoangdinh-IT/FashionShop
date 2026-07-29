using FashionShop.Core.Contracts.Admin.Color.Requests;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminColorService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminColorResponse>> GetAllColorsAsync();
        Task<PagedResult<AdminColorResponse>> GetPagedColorsAsync(AdminColorListRequest request);
        Task<AdminColorResponse?> GetColorByIdAsync(int colorId);



        // --- WRITE METHODS --- //

        Task<AdminColorResponse?> CreateColorAsync(AdminCreateColorRequest dto);
        Task<AdminColorResponse?> UpdateColorAsync(int colorId, AdminUpdateColorRequest dto);
        Task DeleteColorAsync(int colorId);
    }
}
