using FashionShop.Core.Contracts.Admin.Color.Requests;
using FashionShop.Core.Contracts.Admin.Color.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IColorRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminColorResponse>> GetAllColorsAsync();
        Task<PagedResult<AdminColorResponse>> GetPagedColorsAsync(AdminColorListRequest request);
        Task<AdminColorResponse?> GetColorByIdAsync(int colorId);
        Task<Color?> FindColorByIdAsync(int colorId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistHexCodeAsync(string hexCode);
        Task<bool> CheckExistSlugAsync(string slug);
        Task<bool> IsSafeToActionAsync(int colorId);



        // --- WRITE METHODS --- //

        Task<Color?> CreateColorAsync(Color color);
        Task<Color> UpdateColorAsync(Color color);
        Task DeleteColorAsync(Color color);
    }
}
