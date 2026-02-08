using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.DTOs.Size;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ISizeRepository
    {
        Task<Size?> CreateSizeAsync(Size size);
        Task<PagedResult<SizeDTO>> GetPagedSizesAsync(SizeListRequest request);
        Task<Size?> FindSizeByIdAsync(int sizeId);
        Task<SizeDTO?> GetSizeByIdAsync(int sizeId);
        Task<bool> IsSafeToActionAsync(int sizeId);
        Task<Size> UpdateSizeAsync(Size size);
        Task DeleteSizeAsync(Size size);
    }
}
