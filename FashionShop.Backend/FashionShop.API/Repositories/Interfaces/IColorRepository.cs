using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IColorRepository
    {
        // --- READ METHODS --- //
        Task<IEnumerable<ColorResponse>> GetAllColorsAsync();
        Task<PagedResult<ColorResponse>> GetPagedColorsAsync(ColorListRequest request);
        Task<ColorResponse?> GetColorByIdAsync(int colorId);
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
