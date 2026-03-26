using FashionShop.Core.DTOs.Color;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface IColorService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<ColorDTO>> GetAllColorsAsync();
        Task<PagedResult<ColorDTO>> GetPagedColorsAsync(ColorListRequest request);
        Task<ColorDTO?> GetColorByIdAsync(int colorId);

        // --- WRITE METHODS --- //
        Task<ColorDTO?> CreateColorAsync(CreateColorDTO dto);
        Task<ColorDTO?> UpdateColorAsync(int colorId, UpdateColorDTO dto);
        Task DeleteColorAsync(int colorId);
    }
}
