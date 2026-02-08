using FashionShop.Core.DTOs.Size;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Services.Interfaces
{
    public interface ISizeService
    {
        Task<SizeDTO?> CreateSizeAsync(CreateSizeDTO dto);
        Task<PagedResult<SizeDTO>> GetPagedSizesAsync(SizeListRequest request);
        Task<SizeDTO?> GetSizeByIdAsync(int sizeId);
        Task<SizeDTO?> UpdateSizeAsync(int sizeId, UpdateSizeDTO dto);
        Task DeleteSizeAsync(int sizeId);
    }
}
