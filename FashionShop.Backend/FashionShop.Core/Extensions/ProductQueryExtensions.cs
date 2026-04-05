using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class ProductQueryExtensions
    {
        public static IQueryable<Product> FilterByKeyword(this IQueryable<Product> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            string word = keyword.ToLower().Trim();

            return query.Where(x => x.Name.ToLower().Contains(word) ||
                                    x.Slug.ToLower().Contains(word) ||
                                    x.Material.ToLower().Contains(word));
        }

        public static IQueryable<Product> FilterByCategory(this IQueryable<Product> query, Guid? categoryId)
        {
            if (!categoryId.HasValue) return query;

            return query.Where(x => x.CategoryId == categoryId);
        }

        public static IQueryable<Product> FilterByBrand(this IQueryable<Product> query, Guid? brandId)
        {
            if (!brandId.HasValue) return query;

            return query.Where(x => x.BrandId == brandId);
        }

        public static IQueryable<Product> FilterByColor(this IQueryable<Product> query, List<int>? colorIds)
        {
            if (colorIds == null || !colorIds.Any()) return query;

            return query.Where(p => p.ProductVariants.Any(v => colorIds.Contains(v.ColorId)));
        }

        public static IQueryable<Product> FilterBySize(this IQueryable<Product> query, List<int> sizeIds)
        {
            if (sizeIds == null || !sizeIds.Any()) return query;

            return query.Where(p => p.ProductVariants.Any(v => sizeIds.Contains(v.SizeId)));
        }

        public static IQueryable<Product> FilterByActive(this IQueryable<Product> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Product> FilterByBestSeller(this IQueryable<Product> query, bool? isBestSeller)
        {
            if (!isBestSeller.HasValue) return query;

            return query.Where(x => x.IsBestSeller == isBestSeller.Value);
        }

        public static IQueryable<Product> FilterByNew(this IQueryable<Product> query, bool? isNew)
        {
            if (!isNew.HasValue) return query;

            return query.Where(x => x.IsNew == isNew.Value);
        }

        public static IQueryable<Product> FilterByPrice(this IQueryable<Product> query, decimal? minPrice, decimal? maxPrice)
        {
            if (minPrice.HasValue) query = query.Where(x => x.Price >= minPrice.Value);
            if (maxPrice.HasValue) query = query.Where(x => x.Price <= maxPrice.Value);
            return query;
        }

        public static IQueryable<Product> Sort(this IQueryable<Product> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "name":
                    return isAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);

                case "price":
                    return isAscending
                        ? query.OrderBy(x => x.Price)
                        : query.OrderByDescending(x => x.Price);

                case "createddate":
                    return isAscending
                        ? query.OrderBy(x => x.CreatedDate)
                        : query.OrderByDescending(x => x.CreatedDate);

                case "isactive":
                    return isAscending
                        ? query.OrderByDescending(x => x.IsActive)
                        : query.OrderBy(x => x.IsActive);

                default:
                    return query.OrderByDescending(x => x.CreatedDate);
            }
        }
    }
}
