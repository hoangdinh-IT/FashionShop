using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IColorRepository
    {
        // --- READ METHODS --- //
        Task<PagedResult<ColorDTO>> GetPagedColorsAsync(ColorListRequest request);
        Task<ColorDTO?> GetColorByIdAsync(int colorId);
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
