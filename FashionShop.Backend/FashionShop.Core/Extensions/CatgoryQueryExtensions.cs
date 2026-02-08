using FashionShop.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class CatgoryQueryExtensions
    {
        public static IQueryable<Category> FilterByKeyword(this IQueryable<Category> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            var word = keyword.ToLower().Trim();

            return query.Where(x => x.Name.ToLower().Contains(word) ||
                                    x.Slug.ToLower().Contains(word));
        }

        public static IQueryable<Category> FilterByActive(this IQueryable<Category> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Category> FilterByParentId(this IQueryable<Category> query, Guid? parentId)
        {
            if (!parentId.HasValue) return query;

            return query.Where(x => x.ParentId == parentId.Value);
        }

        public static IQueryable<Category> Sort(this IQueryable<Category> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "name":
                    return isAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);

                case "slug":
                    return isAscending
                        ? query.OrderBy(x => x.Slug)
                        : query.OrderByDescending(x => x.Slug);

                case "productCount":
                    return isAscending
                        ? query.OrderBy(x => x.Products.Count())
                        : query.OrderByDescending(x => x.Products.Count());

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
