using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.DTOs.Size;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ISizeRepository
    {
        // --- READ METHODS --- //
        Task<PagedResult<SizeDTO>> GetPagedSizesAsync(SizeListRequest request);
        Task<SizeDTO?> GetSizeByIdAsync(int sizeId);
        Task<Size?> FindSizeByIdAsync(int sizeId);

        // --- VALIDATION METHODS --- //
        Task<bool> IsSafeToActionAsync(int sizeId);

        // --- WRITE METHODS --- //
        Task<Size?> CreateSizeAsync(Size size);
        Task<Size> UpdateSizeAsync(Size size);
        Task DeleteSizeAsync(Size size);
    }
}
