using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Order.Requests;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminOrderRepository : IAdminOrderRepository
    {
        private readonly FashionDbContext _context;

        public AdminOrderRepository(FashionDbContext context)
        {
            _context = context;
        }

        private readonly Expression<Func<Order, AdminOrderSummaryResponse>> _orderSummarySelector =
            order => new AdminOrderSummaryResponse
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                FullName = order.Address.FullName ?? "",
                PhoneNumber = order.Address.PhoneNumber ?? "",
                ShippingAddress = order.Address.AddressDetail,
                ShippingCommune = order.Address.Commune,
                ShippingDistrict = order.Address.District,
                ShippingCity = order.Address.City,
                OrderStatus = order.OrderStatus.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                PaymentStatus = order.PaymentStatus.ToString(),
                SubTotal = order.SubTotal,

                TotalItemCount = order.OrderItems.Count,
                OrderItems = order.OrderItems.Select(orderItem => new AdminOrderItemSummaryResponse
                {
                    ImageUrl = orderItem.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == orderItem.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? orderItem.ProductVariant.Product.ThumbnailUrl,
                }).ToList()
            };

        private readonly Expression<Func<Order, AdminOrderDetailResponse>> _orderDetailSelector =
            order => new AdminOrderDetailResponse
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                PaymentStatus = order.PaymentStatus.ToString(),
                ShippingTrackingCode = order.ShippingTrackingCode,
                PaymentDate = order.PaymentDate,

                FullName = order.Address.FullName,
                PhoneNumber = order.Address.PhoneNumber ?? "",
                ShippingAddress = order.Address.AddressDetail,
                ShippingCommune = order.Address.Commune,
                ShippingDistrict = order.Address.District,
                ShippingCity = order.Address.City,
                Note = order.Note,

                SubTotal = order.SubTotal,
                ShippingFee = order.ShippingFee,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,

                OrderItems = order.OrderItems.Select(orderItem => new AdminOrderItemDetailResponse
                {
                    OrderItemId = orderItem.Id,
                    ProductVariantId = orderItem.ProductVariantId,
                    ProductName = orderItem.ProductVariant.Product.Name,
                    VariantName = orderItem.ProductVariant.Color.Name + " - " + orderItem.ProductVariant.Size.Name,
                    ImageUrl = orderItem.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == orderItem.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? orderItem.ProductVariant.Product.ThumbnailUrl,
                    UnitPrice = orderItem.ProductVariant.Product.Price,
                    Quantity = orderItem.Quantity,
                    TotalLine = orderItem.TotalLine,
                    IsReviewed = orderItem.Reviews.Any(),
                }).ToList()
            };



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminOrderSummaryResponse>> GetOrdersAsync(AdminOrderListRequest request)
        {
            var query = _context.Orders.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByOrderStatus(request.OrderStatus)
                         .FilterByPaymentMethod(request.PaymentMethod)
                         .FilterByPaymentStatus(request.PaymentStatus)
                         .FilterByOrderDate(request.FromOrderDate, request.ToOrderDate);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_orderSummarySelector)
                                  .ToListAsync();

            return new PagedResult<AdminOrderSummaryResponse>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex,
            };
        }

        public async Task<Order?> FindOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders.FirstOrDefaultAsync(order => order.Id == orderId);
        }

        public async Task<AdminOrderDetailResponse?> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(order => order.Id == orderId)
                .Select(_orderDetailSelector)
                .FirstOrDefaultAsync(); 
        }
    }
}
