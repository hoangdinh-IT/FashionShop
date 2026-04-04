using FashionShop.Core.Entities;
using FashionShop.Core.Contracts.Admin.Size.Responses;
using FashionShop.Core.Contracts.Admin.Size.Requests;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ISizeRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminSizeResponse>> GetAllSizesAsync();
        Task<PagedResult<AdminSizeResponse>> GetPagedSizesAsync(AdminSizeListRequest request);
        Task<AdminSizeResponse?> GetSizeByIdAsync(int sizeId);
        Task<Size?> FindSizeByIdAsync(int sizeId);



        // --- VALIDATION METHODS --- //

        Task<bool> IsSafeToActionAsync(int sizeId);



        // --- WRITE METHODS --- //

        Task<Size?> CreateSizeAsync(Size size);
        Task<Size> UpdateSizeAsync(Size size);
        Task DeleteSizeAsync(Size size);
    }
}
