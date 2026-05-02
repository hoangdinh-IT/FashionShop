using FashionShop.Core.Entities;
using FashionShop.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FashionShop.Core.Extensions
{
    public static class OrderQueryExtensions
    {
        public static IQueryable<Order> FilterByKeyword(this IQueryable<Order> query, string? keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return query;

            var word = keyword.ToLower().Trim();

            return query.Where(x => x.Id.ToString().Contains(word) ||
                                    x.User.FullName.ToLower().Contains(word) ||
                                    x.User.PhoneNumber.Contains(word) ||
                                    x.User.Email.ToLower().Contains(word) ||
                                    (x.ShippingTrackingCode != null && x.ShippingTrackingCode.ToLower().Contains(word)));
        }

        public static IQueryable<Order> FilterByOrderStatus(this IQueryable<Order> query, OrderStatus? orderStatus)
        {
            if (!orderStatus.HasValue) return query;

            return query.Where(x => x.OrderStatus == orderStatus.Value);
        }

        public static IQueryable<Order> FilterByPaymentMethod(this IQueryable<Order> query, PaymentMethod? paymentMethod)
        {
            if (!paymentMethod.HasValue) return query;

            return query.Where(x => x.PaymentMethod == paymentMethod.Value);
        }

        public static IQueryable<Order> FilterByPaymentStatus(this IQueryable<Order> query, PaymentStatus? paymentStatus)
        {
            if (!paymentStatus.HasValue) return query;

            return query.Where(x => x.PaymentStatus == paymentStatus.Value);
        }

        public static IQueryable<Order> FilterByOrderDate(this IQueryable<Order> query, DateTime? fromOrderDate, DateTime? toOrderDate)
        {
            if (fromOrderDate.HasValue) query = query.Where(x => x.OrderDate >= fromOrderDate.Value);
            if (toOrderDate.HasValue) query = query.Where(x => x.OrderDate <= toOrderDate.Value);
            return query;
        }
    }
}
