using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class ProductVariantExtensions
    {
        public static IQueryable<ProductVariant> FilterByKeyword(this IQueryable<ProductVariant> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            string word = keyword.ToLower().Trim();

            return query.Where(x => x.Sku.ToLower().Contains(word));
        }

        public static IQueryable<ProductVariant> FilterByProduct(this IQueryable<ProductVariant> query, Guid? productId)
        {
            if (!productId.HasValue) return query;

            return query.Where(x => x.ProductId == productId);
        }

        public static IQueryable<ProductVariant> FilterByColor(this IQueryable<ProductVariant> query, int? colorId)
        {
            if (!colorId.HasValue) return query;

            return query.Where(x => x.ColorId == colorId);
        }

        public static IQueryable<ProductVariant> FilterBySize(this IQueryable<ProductVariant> query, int? sizeId)
        {
            if (!sizeId.HasValue) return query;

            return query.Where(x => x.SizeId == sizeId);
        }

        public static IQueryable<ProductVariant> FilterByPrice(this IQueryable<ProductVariant> query, decimal? minPrice, decimal? maxPrice)
        {
            if (minPrice.HasValue) query = query.Where(x => x.Price >= minPrice.Value);
            if (maxPrice.HasValue) query = query.Where(x => x.Price <= maxPrice.Value);
            return query;
        }
    }
}
