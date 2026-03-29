using FashionShop.Core.Contracts.Color.Requests;
using FashionShop.Core.Contracts.Color.Responses;
using FashionShop.Core.Models.Colors;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface IColorService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<ColorResponse>> GetAllColorsAsync();
        Task<PagedResult<ColorResponse>> GetPagedColorsAsync(ColorListRequest request);
        Task<ColorResponse?> GetColorByIdAsync(int colorId);

        // --- WRITE METHODS --- //
        Task<ColorResponse?> CreateColorAsync(CreateColorRequest dto);
        Task<ColorResponse?> UpdateColorAsync(int colorId, UpdateColorRequest dto);
        Task DeleteColorAsync(int colorId);
    }
}
