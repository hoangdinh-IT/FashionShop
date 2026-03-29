using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;
using FashionShop.Core.Contracts.Size.Responses;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ISizeRepository
    {
        // --- READ METHODS --- //
        Task<IEnumerable<SizeResponse>> GetAllSizesAsync();
        Task<PagedResult<SizeResponse>> GetPagedSizesAsync(SizeListRequest request);
        Task<SizeResponse?> GetSizeByIdAsync(int sizeId);
        Task<Size?> FindSizeByIdAsync(int sizeId);

        // --- VALIDATION METHODS --- //
        Task<bool> IsSafeToActionAsync(int sizeId);

        // --- WRITE METHODS --- //
        Task<Size?> CreateSizeAsync(Size size);
        Task<Size> UpdateSizeAsync(Size size);
        Task DeleteSizeAsync(Size size);
    }
}
