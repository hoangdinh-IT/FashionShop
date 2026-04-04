using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.Contracts.Admin.Category.Requests;
using FashionShop.Core.Contracts.Admin.Category.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Category, AdminCategoryResponse>> _categorySelector =
            x => new AdminCategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                ParentId = x.ParentId,
                Slug = x.Slug,
                ProductCount = x.Products.Count(),
                ImageUrl = x.ImageUrl,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public CategoryRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<AdminCategoryResponse>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(_categorySelector)
                .ToListAsync();
        }

        public async Task<PagedResult<AdminCategoryResponse>> GetPagedCategoriesAsync(AdminCategoryListRequest request)
        {
            var query = _context.Categories.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByActive(request.IsActive)
                         .FilterByParentId(request.ParentId)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_categorySelector)
                                  .ToListAsync();

            return new PagedResult<AdminCategoryResponse>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<IEnumerable<Category>> GetLeafCategoriesAsync()
        {
            return await _context.Categories
                .Where(x => !x.SubCategories.Any())
                .ToListAsync();
        }

        public async Task<AdminCategoryResponse?> GetCategoryByIdAsync(Guid categoryId)
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(x => x.Id == categoryId)
                .Select(_categorySelector)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AdminCategoryResponse>> GetCategoriesByParentIdAsync(Guid parentId)
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(x => x.ParentId == parentId)
                .OrderByDescending(x => x.CreatedDate)
                .Select(_categorySelector)
                .ToListAsync();
        }

        public async Task<Category?> FindCategoryByIdAsync(Guid categoryId)
            => await _context.Categories.FindAsync(categoryId);



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckSlugExistAsync(string slug)
            => await _context.Categories.AnyAsync(x => x.Slug == slug);

        public async Task<bool> IsSafeToActionAsync(Guid categoryId)
        {
            bool hasProduct = await _context.Products.AnyAsync(x => x.CategoryId == categoryId);

            if (hasProduct) return false;

            var childrenIds = await _context.Categories
                .Where(x => x.ParentId == categoryId)
                .Select(x => x.Id)
                .ToListAsync();

            foreach (var childId in childrenIds)
            {
                bool isChildSafe = await IsSafeToActionAsync(childId);

                if (!isChildSafe) return false;
            }

            return true;
        }



        // --- WRITE METHODS --- //

        public async Task<Category?> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        private async Task DeleteChildrenRecursiveAsync(Guid parentId)
        {
            var children = await _context.Categories
                .Where(cate => cate.ParentId == parentId)
                .ToListAsync();

            if (children.Count == 0) return;

            foreach(var child in children)
            {
                child.IsDeleted = true;
                await DeleteChildrenRecursiveAsync(child.Id);
            }
        }

        public async Task DeleteCategoryAsync(Guid categoryId)
        {
            var currentCategory = await _context.Categories.FindAsync(categoryId);

            if (currentCategory != null)
            {
                currentCategory.IsDeleted = true;
            }

            await DeleteChildrenRecursiveAsync(categoryId);

            await _context.SaveChangesAsync();
        }
    }
}
