using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public static IQueryable<Product> FilterByCategoryId(this IQueryable<Product> query, Guid? categoryId)
        {
            if (!categoryId.HasValue) return query;

            return query.Where(x => x.CategoryId == categoryId.Value);
        }

        public static IQueryable<Product> FilterByCategorySlug(this IQueryable<Product> query, string? categorySlug)
        {
            if (string.IsNullOrWhiteSpace(categorySlug)) return query;

            return query.Where(x => 
                x.Category.Slug == categorySlug ||
                (x.Category.ParentCategory != null && x.Category.ParentCategory.Slug == categorySlug) ||
                (x.Category.ParentCategory != null && x.Category.ParentCategory.ParentCategory != null && x.Category.ParentCategory.ParentCategory.Slug == categorySlug)
            );
        }

        public static IQueryable<Product> FilterByBrandId(this IQueryable<Product> query, Guid? brandId)
        {
            if (!brandId.HasValue) return query;

            return query.Where(x => x.BrandId == brandId.Value);
        }

        public static IQueryable<Product> FilterByBrandSlug(this IQueryable<Product> query, string? brandSlug)
        {
            if (string.IsNullOrWhiteSpace(brandSlug)) return query;

            return query.Where(x => x.Brand.Slug == brandSlug);
        }

        public static IQueryable<Product> FilterByColor(this IQueryable<Product> query, int? colorId)
        {
            if (colorId == null) return query;

            return query.Where(p => p.ProductVariants.Any(v => v.ColorId == colorId));
        }

        public static IQueryable<Product> FilterBySize(this IQueryable<Product> query, List<int>? sizeIds)
        {
            if (sizeIds == null || !sizeIds.Any()) return query;

            return query.Where(p => p.ProductVariants.Any(v => sizeIds.Contains(v.SizeId) && v.Quantity > 0));
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
            if (minPrice.HasValue) query = query.Where(p => p.Price > minPrice);
            if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice);
            return query;
        }

        public static IQueryable<Product> FilterByPriceRange(this IQueryable<Product> query, string? priceRange)
        {
            if (string.IsNullOrWhiteSpace(priceRange)) return query;

            var data = priceRange.Split(",");

            var parameter = Expression.Parameter(typeof(Product), "x");
            Expression? combinedExpression = null;

            foreach (var item in data)
            {
                Expression? currentExpression = null;

                if (item.StartsWith(">"))
                {
                    var priceValue = item.Substring(1);

                    if (decimal.TryParse(priceValue, out var minPrice))
                    {
                        currentExpression = Expression.GreaterThan(
                            Expression.Property(parameter, nameof(Product.Price)),
                            Expression.Constant(minPrice, typeof(decimal))
                        );
                    }
                } 
                else
                {
                    var prices = item.Split("-");;

                    if (decimal.TryParse(prices[0], out var minPrice) && decimal.TryParse(prices[1], out var maxPrice))
                    {
                        var greaterThan = Expression.GreaterThan(
                            Expression.Property(parameter, nameof(Product.Price)),
                            Expression.Constant(minPrice, typeof(decimal))
                        );

                        var lessThanOrEqual = Expression.LessThanOrEqual(
                            Expression.Property(parameter, nameof(Product.Price)),
                            Expression.Constant(maxPrice, typeof(decimal))
                        );

                        currentExpression = Expression.AndAlso(greaterThan, lessThanOrEqual);
                    }
                }

                if (currentExpression != null)
                {
                    combinedExpression = combinedExpression == null
                        ? currentExpression
                        : Expression.OrElse(combinedExpression, currentExpression);
                }
            }

            if (combinedExpression != null)
            {
                var lambda = Expression.Lambda<Func<Product, bool>>(combinedExpression, parameter);
                query = query.Where(lambda);
            }

            return query;
        }

        public static IQueryable<Product> SortByPrice(this IQueryable<Product> query, bool? isAscendingPrice)
        {
            if (isAscendingPrice == true) 
                return query.OrderBy(x => x.Price);
            else if (isAscendingPrice == false) 
                return query.OrderByDescending(x => x.Price);
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
