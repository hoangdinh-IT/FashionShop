using FashionShop.Core.DTOs.Category;
using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.Models.Categories;
using FashionShop.Core.Models.Paging;

namespace FashionShop.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDTO?> CreateCategoryAsync(CreateCategoryDTO dto);
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<PagedResult<CategoryDTO>> GetPagedCategoriesAsync(CategoryListRequest request);
        Task<IEnumerable<CategoryDTO>> GetLeafCategoriesAsync();
        Task<CategoryDTO> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<CategoryDTO>> GetCategoriesByParentIdAsync(Guid parentId);
        Task<CategoryDTO?> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDTO dto);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
