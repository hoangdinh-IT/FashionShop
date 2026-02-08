using FashionShop.API.Data;
using FashionShop.API.Repositories.Interfaces;
using FashionShop.Core.DTOs.Category.Category;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models.Categories;
using FashionShop.Core.Models.Paging;
using Microsoft.EntityFrameworkCore;

namespace FashionShop.API.Repositories.Implements
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly FashionDbContext _context;

        public CategoryRepository(FashionDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckSlugExistAsync(string slug)
        {
            return await _context.Categories.AnyAsync(cate => cate.Slug == slug);
        }

        public async Task<Category?> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            return await _context.Categories.AsNoTracking()
                                            .Select(cate => new CategoryDTO
                                            {
                                                Id = cate.Id,
                                                Name = cate.Name,
                                                Description = cate.Description,
                                                ParentId = cate.ParentId,
                                                Slug = cate.Slug,
                                                ProductCount = cate.Products.Count(),
                                                ImageUrl = cate.ImageUrl,
                                                IsActive = cate.IsActive,
                                                CreatedDate = cate.CreatedDate,
                                                UpdatedDate = cate.UpdatedDate,
                                                IsDeleted = cate.IsDeleted,
                                            })
                                            .ToListAsync();
        }

        public async Task<PagedResult<CategoryDTO>> GetPagedCategoriesAsync(CategoryListRequest request)
        {
            var query = _context.Categories.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByActive(request.IsActive)
                         .FilterByParentId(request.ParentId)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(cate => new CategoryDTO
                                  {
                                      Id = cate.Id,
                                      Name = cate.Name,
                                      Description = cate.Description,
                                      ParentId = cate.ParentId,
                                      Slug = cate.Slug,
                                      ProductCount = cate.Products.Count(),
                                      ImageUrl = cate.ImageUrl,
                                      IsActive = cate.IsActive,
                                      CreatedDate = cate.CreatedDate,
                                      UpdatedDate = cate.UpdatedDate,
                                      IsDeleted = cate.IsDeleted,
                                  })
                                  .ToListAsync();

            return new PagedResult<CategoryDTO>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<IEnumerable<Category>> GetLeafCategoriesAsync()
        {
            return await _context.Categories.Where(cate => !cate.SubCategories.Any())
                                            .ToListAsync();
        }

        public async Task<CategoryDTO?> GetCategoryByIdAsync(Guid categoryId)
        {
            return await _context.Categories.Where(cate => cate.Id == categoryId)
                                            .Select(cate => new CategoryDTO
                                            {
                                                Id = cate.Id,
                                                Name = cate.Name,
                                                Description = cate.Description,
                                                ParentId = cate.ParentId,
                                                Slug = cate.Slug,
                                                ProductCount = cate.Products.Count(),
                                                ImageUrl = cate.ImageUrl,
                                                IsActive = cate.IsActive,
                                                CreatedDate = cate.CreatedDate,
                                                UpdatedDate = cate.UpdatedDate,
                                                IsDeleted = cate.IsDeleted,
                                            })
                                            .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<CategoryDTO>> GetCategoriesByParentIdAsync(Guid parentId)
        {
            return await _context.Categories.AsNoTracking()
                                            .Where(cate => cate.ParentId == parentId)
                                            .Select(cate => new CategoryDTO
                                            {
                                                Id = cate.Id,
                                                Name = cate.Name,
                                                Description = cate.Description,
                                                ParentId = cate.ParentId,
                                                Slug = cate.Slug,
                                                ProductCount = cate.Products.Count(),
                                                ImageUrl = cate.ImageUrl,
                                                IsActive = cate.IsActive,
                                                CreatedDate = cate.CreatedDate,
                                                UpdatedDate = cate.UpdatedDate,
                                                IsDeleted = cate.IsDeleted,
                                            })
                                            .OrderByDescending(brand => brand.CreatedDate)
                                            .ToListAsync();
        }

        public async Task<Category?> FindCategoryByIdAsync(Guid categoryId)
        {
            return await _context.Categories.FindAsync(categoryId);
        }

        public async Task<Category?> UpdateCategoryAsync(Category category)
        {
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> IsSafeToActionAsync(Guid categoryId)
        {
            bool hasProduct = await _context.Products.AnyAsync(prod => prod.CategoryId == categoryId);

            if (hasProduct) return false;

            var childrenIds = await _context.Categories.Where(cate => cate.ParentId == categoryId)
                                                       .Select(cate => cate.Id)
                                                       .ToListAsync();

            foreach(var childId in childrenIds)
            {
                bool isChildSafe = await IsSafeToActionAsync(childId);

                if (!isChildSafe) return false;
            }

            return true;
        }

        private async Task DeleteChildrenRecursiveAsync(Guid parentId)
        {
            var children = await _context.Categories.Where(cate => cate.ParentId == parentId).ToListAsync();

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
