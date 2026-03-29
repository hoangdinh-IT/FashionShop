using FashionShop.Core.Contracts.Size;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Services.Interfaces
{
    public interface ISizeService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<SizeDTO>> GetAllSizesAsync();
        Task<PagedResult<SizeDTO>> GetPagedSizesAsync(SizeListRequest request);
        Task<SizeDTO?> GetSizeByIdAsync(int sizeId);

        // --- WRITE METHODS --- //
        Task<SizeDTO?> CreateSizeAsync(CreateSizeDTO dto);
        Task<SizeDTO?> UpdateSizeAsync(int sizeId, UpdateSizeDTO dto);
        Task DeleteSizeAsync(int sizeId);
    }
}
