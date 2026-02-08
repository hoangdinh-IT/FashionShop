using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class SizeQueryExtensions
    {
        public static IQueryable<Size> FilterByKeyword(this IQueryable<Size> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            var word = keyword.ToLower().Trim();

            if (word == "xxl") word = "2xl";
            if (word == "xxxl") word = "3xl";

            return query.Where(x => x.Name.ToLower().Contains(word));
        }

        public static IQueryable<Size> FilterByType(this IQueryable<Size> query, SizeType? type)
        {
            if (!type.HasValue) return query;

            return query.Where(x => x.Type == type);
        }

        public static IQueryable<Size> FilterByActive(this IQueryable<Size> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Size> Sort(this IQueryable<Size> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "name":
                    return isAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);

                case "sortorder":
                    return isAscending
                        ? query.OrderBy(x => x.SortOrder)
                        : query.OrderByDescending(x => x.SortOrder);

                case "type":
                    return isAscending
                        ? query.OrderBy(x => x.Type)
                        : query.OrderByDescending(x => x.Type);

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
