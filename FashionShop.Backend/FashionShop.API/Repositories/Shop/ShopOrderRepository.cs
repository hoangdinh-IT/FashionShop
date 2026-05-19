using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Admin.Order.Responses;
using FashionShop.Core.Contracts.Shop.Order.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopOrderRepository : IShopOrderRepository
    {
        private readonly FashionDbContext _context;

        public ShopOrderRepository(FashionDbContext context)
        {
            _context = context;
        }

        private readonly Expression<Func<Order, ShopOrderSummaryResponse>> _orderSummarySelector =
            order => new ShopOrderSummaryResponse
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                ShippingAddress = order.Address.AddressDetail,
                ShippingCommune = order.Address.Commune,
                ShippingDistrict = order.Address.District,
                ShippingCity = order.Address.City,
                OrderStatus = order.OrderStatus,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                SubTotal = order.SubTotal,
                ShippingFee = order.ShippingFee,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,
                Note = order.Note,
                ShippingTrackingCode = order.ShippingTrackingCode,
                PaymentDate = order.PaymentDate,
                OrderItems = order.OrderItems.Select(orderItem => new ShopOrderItemSummaryResponse
                {
                    OrderItemId = orderItem.Id,
                    ProductVariantId = orderItem.ProductVariantId,
                    ProductName = orderItem.ProductVariant.Product.Name,
                    ProductSlug = orderItem.ProductVariant.Product.Slug,
                    VariantName = orderItem.ProductVariant.Color.Name + " - " + orderItem.ProductVariant.Size.Name,
                    BrandName = orderItem.ProductVariant.Product.Brand.Name,
                    BrandLogoUrl = orderItem.ProductVariant.Product.Brand.LogoUrl,
                    ImageUrl = orderItem.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == orderItem.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? orderItem.ProductVariant.Product.ThumbnailUrl,
                    UnitPrice = orderItem.UnitPrice,
                    Quantity = orderItem.Quantity,
                    TotalLine = orderItem.TotalLine,
                    IsReviewed = orderItem.Reviews.Any()
                }).ToList()
            };

        private readonly Expression<Func<Order, ShopOrderDetailResponse>> _orderDetailSelector =
            order => new ShopOrderDetailResponse
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

                OrderItems = order.OrderItems.Select(orderItem => new ShopOrderItemDetailResponse
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

        public async Task<IEnumerable<ShopOrderSummaryResponse?>> GetOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(order => order.UserId == userId)
                .OrderByDescending(order => order.CreatedDate)
                .Select(_orderSummarySelector)
                .ToListAsync();
        }

        public async Task<Order?> FindOrderByIdAsync(Guid userId, Guid orderId)
        {
            return await _context.Orders
                .FirstOrDefaultAsync(order => order.UserId == userId && order.Id == orderId);
        }

        public async Task<ShopOrderDetailResponse?> GetOrderByIdAsync(Guid userId, Guid orderId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(order => order.UserId == userId && order.Id == orderId)
                .Select(_orderDetailSelector)
                .FirstOrDefaultAsync();
        }



        // --- WRITE METHODS --- //

        public void Create(Order order)
        {
            _context.Orders.Add(order);
        }
    }
}
