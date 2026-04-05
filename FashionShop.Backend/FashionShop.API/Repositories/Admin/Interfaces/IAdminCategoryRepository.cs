using FashionShop.Core.Contracts.Admin.Category.Requests;
using FashionShop.Core.Contracts.Admin.Category.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminCategoryRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AdminCategoryResponse>> GetAllCategoriesAsync();
        Task<PagedResult<AdminCategoryResponse>> GetPagedCategoriesAsync(AdminCategoryListRequest request);
        Task<IEnumerable<Category>> GetLeafCategoriesAsync();
        Task<AdminCategoryResponse?> GetCategoryByIdAsync(Guid categoryId);
        Task<IEnumerable<AdminCategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId);
        Task<Category?> FindCategoryByIdAsync(Guid categoryId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckSlugExistAsync(string slug);
        Task<bool> IsSafeToActionAsync(Guid categoryId);



        // --- WRITE METHODS --- //

        void CreateCategory(Category category);
        Task DeleteCategoryAsync(Guid categoryId);
    }
}
