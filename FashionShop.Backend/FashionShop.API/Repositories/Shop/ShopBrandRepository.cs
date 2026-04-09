using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Brand.Responses;
using FashionShop.Core.Contracts.Shop.Category.Responses;
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
            // BƯỚC 1: Tìm danh sách ID các danh mục CÓ TRỰC TIẾP sản phẩm của Brand A
            var activeCategoryIds = await _context.Products
                .Where(p => p.BrandId == brandId)
                .Select(p => p.CategoryId)
                .Distinct()
                .ToListAsync();

            // Nếu brand không có sản phẩm nào, trả về mảng rỗng
            if (!activeCategoryIds.Any())
            {
                return Enumerable.Empty<ShopCategoryResponse>();
            }

            // BƯỚC 2: Lấy TẤT CẢ danh mục bằng _categorySelector của bạn
            var allCategories = await _context.Categories
                .Select(_categorySelector)
                .ToListAsync();

            // BƯỚC 3: Dựng cây danh mục (Gắn con vào cha)
            var dict = allCategories.ToDictionary(c => c.Id);
            var roots = new List<ShopCategoryResponse>();

            foreach (var cat in allCategories)
            {
                // Khởi tạo list Children nếu chưa có (đề phòng quên khởi tạo ở class)
                cat.Children ??= new List<ShopCategoryResponse>();

                if (cat.ParentId.HasValue && dict.ContainsKey(cat.ParentId.Value))
                {
                    dict[cat.ParentId.Value].Children.Add(cat);
                }
                else
                {
                    roots.Add(cat);
                }
            }

            // BƯỚC 4: Hàm cắt tỉa (Prune) - Xóa bỏ những nhánh không có đồ của Brand A
            var validIdsSet = new HashSet<Guid>(activeCategoryIds);

            bool KeepBranch(ShopCategoryResponse node)
            {
                // Đi ngược từ dưới lên để check các danh mục con
                for (int i = node.Children.Count - 1; i >= 0; i--)
                {
                    if (!KeepBranch(node.Children[i]))
                    {
                        node.Children.RemoveAt(i); // Cắt bỏ nhánh con nếu không hợp lệ
                    }
                }

                // Giữ lại danh mục này nếu: bản thân nó có sản phẩm, HOẶC nó có chứa nhánh con hợp lệ
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
    }
}
