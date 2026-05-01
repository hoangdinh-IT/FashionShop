using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
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

        private readonly Expression<Func<Order, ShopOrderResponse>> _orderSelector =
            order => new ShopOrderResponse
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                ShippingCommune = order.ShippingCommune,
                ShippingDistrict = order.ShippingDistrict,
                ShippingCity = order.ShippingCity,
                OrderStatus = order.OrderStatus.ToString(),
                PaymentMethod = order.PaymentMethod.ToString(),
                PaymentStatus = order.PaymentStatus.ToString(),
                SubTotal = order.SubTotal,
                ShippingFee = order.ShippingFee,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,
                Note = order.Note,
                ShippingTrackingCode = order.ShippingTrackingCode,
                PaymentDate = order.PaymentDate,
                OrderDetails = order.OrderDetails.Select(od => new ShopOrderDetailResponse
                {
                    Id = od.Id,
                    ProductVariantId = od.ProductVariantId,
                    ProductName = od.ProductVariant.Product.Name,
                    VariantName = od.ProductVariant.Color.Name + " - " + od.ProductVariant.Size.Name,
                    ImageUrl = od.ProductVariant.Product.ProductImages
                        .Where(pi => pi.ColorId == od.ProductVariant.ColorId)
                        .OrderBy(pi => pi.SortOrder)
                        .Select(pi => pi.ImageUrl)
                        .FirstOrDefault()
                        ?? od.ProductVariant.Product.ThumbnailUrl,
                    UnitPrice = od.UnitPrice,
                    Quantity = od.Quantity,
                    TotalLine = od.TotalLine,
                    IsReviewed = od.Reviews.Any()
                }).ToList()
            };



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopOrderResponse?>> GetOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(order => order.UserId == userId)
                .Select(_orderSelector)
                .ToListAsync();
        }

        public async Task<ShopOrderResponse?> GetOrderByIdAsync(Guid userId, Guid orderId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(order => order.UserId == userId && order.Id == orderId)
                .Select(_orderSelector)
                .FirstOrDefaultAsync();
        }



        // --- WRITE METHODS --- //

        public void Create(Order order)
        {
            _context.Orders.Add(order);
        }
    }
}
