using FashionShop.Core.Contracts.Size.Requests;
using FashionShop.Core.Contracts.Size.Responses;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Sizes;

namespace FashionShop.API.Services.Interfaces
{
    public interface ISizeService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<SizeResponse>> GetAllSizesAsync();
        Task<PagedResult<SizeResponse>> GetPagedSizesAsync(SizeListRequest request);
        Task<SizeResponse?> GetSizeByIdAsync(int sizeId);

        // --- WRITE METHODS --- //
        Task<SizeResponse?> CreateSizeAsync(CreateSizeRequest dto);
        Task<SizeResponse?> UpdateSizeAsync(int sizeId, UpdateSizeRequest dto);
        Task DeleteSizeAsync(int sizeId);
    }
}
