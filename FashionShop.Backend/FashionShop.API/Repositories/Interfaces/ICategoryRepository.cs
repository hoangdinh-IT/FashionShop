using FashionShop.Core.Contracts.Category;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Categories;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        // --- READ METHODS --- //
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryDTO>> GetPagedCategoriesAsync(CategoryListRequest request);
        Task<IEnumerable<Category>> GetLeafCategoriesAsync();
        Task<CategoryDTO?> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<CategoryDTO>> GetCategoriesByParentIdAsync(Guid parentId);
        Task<Category?> FindCategoryByIdAsync(Guid categoryId);

        // --- VALIDATION METHODS --- //
        Task<bool> CheckSlugExistAsync(string slug);
        Task<bool> IsSafeToActionAsync(Guid categoryId);

        // --- WRITE METHODS --- //
        Task<Category?> CreateCategoryAsync(Category category);
        Task<Category?> UpdateCategoryAsync(Category category);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
