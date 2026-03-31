using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class VoucherQueryExtensions
    {
        public static IQueryable<Voucher> FilterByKeyword(this IQueryable<Voucher> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            string word = keyword.ToLower().Trim();

            return query.Where(x => x.Name.ToLower().Contains(word) ||
                                    x.Code.ToLower().Contains(word));
        }

        public static IQueryable<Voucher> FilterByDiscountType(this IQueryable<Voucher> query, DiscountType? discountType)
        {
            if (!discountType.HasValue) return query;

            return query.Where(x => x.DiscountType == discountType.Value);
        }

        public static IQueryable<Voucher> FilterByActive(this IQueryable<Voucher> query, bool? isActive)
        {
            if (!isActive.HasValue) return query;

            return query.Where(x => x.IsActive == isActive.Value);
        }

        public static IQueryable<Voucher> FilterByDate(this IQueryable<Voucher> query, DateTime? fromDate, DateTime? toDate)
        {
            if (fromDate.HasValue) query = query.Where(x => x.StartDate >= fromDate);
            if (toDate.HasValue) query = query.Where(x => x.EndDate <= toDate);
            return query;
        }
        
        public static IQueryable<Voucher> FilterByStatus(this IQueryable<Voucher> query, string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return query;

            var now = DateTime.Now;

            switch(status.ToLower())
            {
                case "upcoming":
                    query = query.Where(x => x.StartDate > now);
                    break;

                case "ongoing":
                    query = query.Where(x => x.StartDate <= now && x.EndDate >= now);
                    break;

                case "expire":
                    query = query.Where(x => x.EndDate > now);
                    break;

                default:
                    break;
            }

            return query;
        }

        public static IQueryable<Voucher> FilterByAvailable(this IQueryable<Voucher> query, bool? isAvailable)
        {
            if (!isAvailable.HasValue) return query;

            if (isAvailable.Value) 
                return query.Where(x => x.Quantity > x.UsedCount);
            else 
                return query.Where(x => x.Quantity <= x.UsedCount);
                
        }

        public static IQueryable<Voucher> FilterByMinOrderValue(this IQueryable<Voucher> query, decimal? fromMinOrderValue, decimal? toMinOrderValue)
        {
            if (fromMinOrderValue.HasValue) query = query.Where(x => x.MinOrderValue >= fromMinOrderValue);
            if (toMinOrderValue.HasValue) query = query.Where(x => x.MinOrderValue <= toMinOrderValue);
            return query;
        }

        public static IQueryable<Voucher> Sort(this IQueryable<Voucher> query, string? sortBy, bool isAscending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return query.OrderByDescending(x => x.CreatedDate);

            switch (sortBy.ToLower().Trim())
            {
                case "name":
                    return isAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);

                case "code":
                    return isAscending
                        ? query.OrderBy(x => x.Code)
                        : query.OrderByDescending(x => x.Code);

                case "discounttype":
                    return isAscending
                        ? query.OrderBy(x => x.DiscountAmount)
                        : query.OrderByDescending(x => x.DiscountAmount);

                case "maxdiscountamount":
                    return isAscending
                        ? query.OrderBy(x => x.MaxDiscountAmount)
                        : query.OrderByDescending(x => x.MaxDiscountAmount);

                case "minordervalue":
                    return isAscending
                        ? query.OrderBy(x => x.MinOrderValue)
                        : query.OrderByDescending(x => x.MinOrderValue);

                case "quantity":
                    return isAscending
                        ? query.OrderBy(x => x.Quantity)
                        : query.OrderByDescending(x => x.Quantity);

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
