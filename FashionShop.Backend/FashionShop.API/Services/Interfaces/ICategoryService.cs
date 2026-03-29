using FashionShop.Core.Contracts.Category.Requests;
using FashionShop.Core.Contracts.Category.Responses;
using FashionShop.Core.Models.Categories;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface ICategoryService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryResponse>> GetPagedCategoriesAsync(CategoryListRequest request);
        Task<IEnumerable<CategoryResponse>> GetLeafCategoriesAsync();
        Task<CategoryResponse> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<CategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId);

        // --- WRITE METHODS --- //
        Task<CategoryResponse?> CreateCategoryAsync(CreateCategoryRequest dto);
        Task<CategoryResponse?> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest dto);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
