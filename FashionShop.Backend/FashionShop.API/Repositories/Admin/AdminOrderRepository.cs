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
                FullName = order.User.FullName ?? "",
                PhoneNumber = order.User.PhoneNumber ?? "",
                ShippingAddress = order.ShippingAddress,
                ShippingCommune = order.ShippingCommune,
                ShippingDistrict = order.ShippingDistrict,
                ShippingCity = order.ShippingCity,
                OrderStatus = order.OrderStatus.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                PaymentStatus = order.PaymentStatus.ToString(),
                TotalAmount = order.TotalAmount,

                TotalItemCount = order.OrderItems.Count,
                OrderItems = order.OrderItems.Select(od => new AdminOrderItemSummaryResponse
                {
                    ImageUrl = od.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == od.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? od.ProductVariant.Product.ThumbnailUrl,
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

                FullName = order.User.FullName ?? "",
                PhoneNumber = order.User.PhoneNumber ?? "",
                ShippingAddress = order.ShippingAddress,
                ShippingCommune = order.ShippingCommune,
                ShippingDistrict = order.ShippingDistrict,
                ShippingCity = order.ShippingCity,
                Note = order.Note,

                SubTotal = order.SubTotal,
                ShippingFee = order.ShippingFee,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,

                OrderItems = order.OrderItems.Select(od => new AdminOrderItemDetailResponse
                {
                    OrderItemId = od.Id,
                    ProductVariantId = od.ProductVariantId,
                    ProductName = od.ProductVariant.Product.Name,
                    VariantName = od.ProductVariant.Color.Name + " - " + od.ProductVariant.Size.Name,
                    ImageUrl = od.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == od.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? od.ProductVariant.Product.ThumbnailUrl,
                    UnitPrice = od.ProductVariant.Product.Price,
                    Quantity = od.Quantity,
                    TotalLine = od.TotalLine,
                    IsReviewed = od.Reviews.Any(),
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
