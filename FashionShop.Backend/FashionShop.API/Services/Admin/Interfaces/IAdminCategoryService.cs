using FashionShop.Core.Contracts.Admin.Category.Requests;
using FashionShop.Core.Contracts.Admin.Category.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminCategoryService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminCategoryResponse>> GetAllCategoriesAsync();
        Task<PagedResult<AdminCategoryResponse>> GetPagedCategoriesAsync(AdminCategoryListRequest request);
        Task<IEnumerable<AdminCategoryResponse>> GetLeafCategoriesAsync();
        Task<AdminCategoryResponse> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<AdminCategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId);



        // --- WRITE METHODS --- //

        Task<AdminCategoryResponse?> CreateCategoryAsync(CreateCategoryRequest dto);
        Task<AdminCategoryResponse?> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest dto);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
