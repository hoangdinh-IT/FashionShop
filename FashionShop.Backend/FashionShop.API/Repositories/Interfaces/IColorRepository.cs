using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IColorRepository
    {
        Task<bool> CheckExistHexCodeAsync(string hexCode);
        Task<bool> CheckExistSlugAsync(string slug);
        Task<Color?> CreateColorAsync(Color color);
        Task<PagedResult<ColorDTO>> GetPagedColorsAsync(ColorListRequest request);
        Task<Color?> FindColorByIdAsync(int colorId); 
        Task<ColorDTO?> GetColorByIdAsync(int colorId);
        Task<Color> UpdateColorAsync(Color color);
        Task<bool> IsSafeToActionAsync(int colorId);
        Task DeleteColorAsync(Color color);
    }
}
