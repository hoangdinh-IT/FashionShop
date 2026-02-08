using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class ColorQueryExtensions
    {
        public static IQueryable<Color> FilterByKeyword(this IQueryable<Color> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            var word = keyword.ToLower().Trim();

            return query.Where(x => x.Name.ToLower().Contains(word) ||
                                    x.HexCode.ToLower().Contains(word));
        }

        public static IQueryable<Color> FilterByActive(this IQueryable<Color> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Color> Sort(this IQueryable<Color> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "name":
                    return isAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);

                case "hexcode":
                    return isAscending
                        ? query.OrderBy(x => x.HexCode)
                        : query.OrderByDescending(x => x.HexCode);

                case "productCount":
                    return isAscending
                        ? query.OrderBy(x => x.ProductVariants.Count())
                        : query.OrderByDescending(x => x.ProductVariants.Count());

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
