using FashionShop.Core.Entities;
using FashionShop.Core.Enums;

namespace FashionShop.Core.Extensions
{
    public static class CouponQueryExtensions
    {
        public static IQueryable<Coupon> FilterByKeyword(this IQueryable<Coupon> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            string word = keyword.ToLower().Trim();

            return query.Where(x => x.Name.ToLower().Contains(word) ||
                                    x.Code.ToLower().Contains(word));
        }

        public static IQueryable<Coupon> FilterByDiscountType(this IQueryable<Coupon> query, DiscountType? discountType)
        {
            if (!discountType.HasValue) return query;

            return query.Where(x => x.DiscountType == discountType.Value);
        }

        public static IQueryable<Coupon> FilterByActive(this IQueryable<Coupon> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Coupon> FilterByDate(this IQueryable<Coupon> query, DateTime? fromDate, DateTime? toDate)
        {
            if (fromDate.HasValue) query = query.Where(x => x.StartDate >= fromDate);
            if (toDate.HasValue) query = query.Where(x => x.EndDate <= toDate);
            return query;
        }
        
        public static IQueryable<Coupon> FilterByStatus(this IQueryable<Coupon> query, string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return query;

            var now = DateTime.UtcNow;

            switch(status.ToLower())
            {
                case "upcoming":
                    query = query.Where(x => x.StartDate > now);
                    break;

                case "ongoing":
                    query = query.Where(x => x.StartDate <= now && x.EndDate >= now);
                    break;

                case "expired":
                    query = query.Where(x => x.EndDate < now);
                    break;

                default:
                    break;
            }

            return query;
        }

        public static IQueryable<Coupon> FilterByAvailable(this IQueryable<Coupon> query, bool? isAvailable)
        {
            if (!isAvailable.HasValue) return query;

            if (isAvailable.Value) 
                return query.Where(x => x.Quantity > x.UsedCount);
            else 
                return query.Where(x => x.Quantity <= x.UsedCount);
                
        }

        public static IQueryable<Coupon> FilterByMinOrderValue(this IQueryable<Coupon> query, decimal? fromMinOrderValue, decimal? toMinOrderValue)
        {
            if (fromMinOrderValue.HasValue) query = query.Where(x => x.MinOrderValue >= fromMinOrderValue);
            if (toMinOrderValue.HasValue) query = query.Where(x => x.MinOrderValue <= toMinOrderValue);
            return query;
        }

        public static IQueryable<Coupon> Sort(this IQueryable<Coupon> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "code":
                    return isAscending
                        ? query.OrderBy(x => x.Code)
                        : query.OrderByDescending(x => x.Code);

                case "discounttype":
                    return isAscending
                        ? query.OrderBy(x => x.DiscountAmount)
                        : query.OrderByDescending(x => x.DiscountAmount);

                case "usedcount":
                    return isAscending
                        ? query.OrderBy(x => x.UsedCount)
                        : query.OrderByDescending(x => x.UsedCount);

                case "startdate":
                    return isAscending
                        ? query.OrderBy(x => x.StartDate)
                        : query.OrderByDescending(x => x.StartDate);

                case "enddate":
                    return isAscending
                        ? query.OrderBy(x => x.EndDate)
                        : query.OrderByDescending(x => x.EndDate);

                case "status":
                    var now = DateTime.UtcNow;

                    // 1 - Ongoing
                    // 2 - Upcoming
                    // 3 - Expired
                    // 4 - Inactive

                    if (isAscending)
                    {
                        return query.OrderBy(x =>
                            !x.IsActive ? 4 :
                            (x.StartDate <= now && x.EndDate >= now) ? 1 :
                            (x.StartDate > now) ? 2 :
                            3
                        );
                    }
                    else
                    {
                        return query.OrderByDescending(x =>
                            !x.IsActive ? 4 :
                            (x.StartDate <= now && x.EndDate >= now) ? 1 :
                            (x.StartDate > now) ? 2 :
                            3
                        );
                    }

                default:
                    return query.OrderByDescending(x => x.CreatedDate);
            }
        }
    }
}
