using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Categories;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<bool> CheckSlugExistAsync(string slug);
        Task<Category?> CreateCategoryAsync(Category category);
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryDTO>> GetPagedCategoriesAsync(CategoryListRequest request);
        Task<IEnumerable<Category>> GetLeafCategoriesAsync();
        Task<CategoryDTO?> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<CategoryDTO>> GetCategoriesByParentIdAsync(Guid parentId);
        Task<Category?> FindCategoryByIdAsync(Guid categoryId);
        Task<Category?> UpdateCategoryAsync(Category category);
        Task<bool> IsSafeToActionAsync(Guid categoryId);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
