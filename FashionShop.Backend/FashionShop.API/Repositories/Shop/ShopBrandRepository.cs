using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Brand.Responses;
using FashionShop.Core.Contracts.Shop.Category.Responses;
using FashionShop.Core.Contracts.Shop.Product.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopBrandRepository : IShopBrandRepository
    {
        private readonly FashionDbContext _context;

        public ShopBrandRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static readonly Expression<Func<Brand, ShopBrandResponse>> _brandSelector =
            x => new ShopBrandResponse()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                LogoUrl = x.LogoUrl,
            };

        private static readonly Expression<Func<Category, ShopCategoryResponse>> _categorySelector =
            x => new ShopCategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Slug = x.Slug,
                ParentId = x.ParentId,
                ImageUrl = x.ImageUrl,
            };

        public async Task<IEnumerable<ShopBrandResponse>> GetAllBrandsAsync()
        {
            return await _context.Brands
                .AsNoTracking()
                .Select(_brandSelector)
                .ToListAsync();
        }

        public async Task<IEnumerable<ShopCategoryResponse>> GetCategoriesByBrandAsync(Guid brandId)
        {
            // BƯỚC 1: Tìm danh sách ID các danh mục CÓ TRỰC TIẾP sản phẩm của Brand
            var activeCategoryIds = await _context.Products
                .Where(p => p.BrandId == brandId)
                .Select(p => p.CategoryId)
                .Distinct()
                .ToListAsync();

            if (!activeCategoryIds.Any())
            {
                return Enumerable.Empty<ShopCategoryResponse>();
            }

            // BƯỚC 2: Lấy TẤT CẢ danh mục
            var allCategories = await _context.Categories
                .Select(_categorySelector)
                .ToListAsync();

            // BƯỚC 3: Dựng cây danh mục (Gắn con vào cha)
            var dict = allCategories.ToDictionary(c => c.Id);
            var roots = new List<ShopCategoryResponse>();

            foreach (var cat in allCategories)
            {
                if (cat.ParentId.HasValue && dict.ContainsKey(cat.ParentId.Value))
                {
                    dict[cat.ParentId.Value].Children.Add(cat);
                }
                else
                {
                    roots.Add(cat);
                }
            }

            // BƯỚC 4: Hàm cắt tỉa (Prune) - Xóa bỏ những nhánh không có đồ của Brand
            var validIdsSet = new HashSet<Guid>(activeCategoryIds);

            bool KeepBranch(ShopCategoryResponse node)
            {
                for (int i = node.Children.Count - 1; i >= 0; i--)
                {
                    if (!KeepBranch(node.Children[i]))
                    {
                        node.Children.RemoveAt(i);
                    }
                }

                return validIdsSet.Contains(node.Id) || node.Children.Any();
            }

            // Lọc lại danh sách gốc (Root)
            for (int i = roots.Count - 1; i >= 0; i--)
            {
                if (!KeepBranch(roots[i]))
                {
                    roots.RemoveAt(i);
                }
            }

            return roots;
        }

        //public async Task<IEnumerable<ProductGridItemResponse>> GetProductsAsync(Guid? brandId, Guid? categoryId)
        //{
        //    var query = _context.Products.AsQueryable();

        //    // Lọc theo Brand
        //    if (brandId.HasValue)
        //    {
        //        query = query.Where(p => p.BrandId == brandId.Value);
        //    }

        //    // Lọc theo Category (Bao gồm cả xử lý Level 2)
        //    if (categoryId.HasValue)
        //    {
        //        // Lấy ID của category hiện tại VÀ tất cả ID của các category con trực tiếp
        //        // Ví dụ: Nhận ID của "Áo thun" (Level 2) -> Lấy thêm ID của "Áo thun Polo", "Áo thun Basic" (Level 3)
        //        var categoryIds = await _context.Categories
        //            .Where(c => c.Id == categoryId.Value || c.ParentId == categoryId.Value)
        //            .Select(c => c.Id)
        //            .ToListAsync();

        //        if (categoryIds.Any())
        //        {
        //            // Lấy tất cả sản phẩm nằm trong danh sách ID vừa tìm được
        //            query = query.Where(p => categoryIds.Contains(p.CategoryId));
        //        }
        //    }

        //    // Map qua DTO và trả về (Thay đổi Select tùy vào hệ thống của bạn)
        //    return await query
        //        .Select(p => new ProductGridItemResponse
        //        {
        //            Id = p.Id,
        //            Name = p.Name,
        //            Price = p.Price,
        //            ThumbnailUrl = p.ThumbnailUrl,
        //            IsNew = p.IsNew,
        //            IsBestSeller = p.IsBestSeller
        //        })
        //        .ToListAsync();
        //}
    }
}
