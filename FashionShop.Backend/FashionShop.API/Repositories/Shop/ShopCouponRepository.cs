using FashionShop.API.Data;
using FashionShop.API.Repositories.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Coupon.Responses;
using FashionShop.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Shop
{
    public class ShopCouponRepository : IShopCouponRepository
    {
        private readonly FashionDbContext _context;

        public ShopCouponRepository(FashionDbContext context)
        {
            _context = context;
        }

        private static Expression<Func<Coupon, ShopCouponResponse>> _couponSelector(Guid userId)
        {
            return Coupon => new ShopCouponResponse
            {
                Id = Coupon.Id,
                Name = Coupon.Name,
                Code = Coupon.Code,
                Description = Coupon.Description,
                DiscountType = Coupon.DiscountType,
                DiscountAmount = Coupon.DiscountAmount,
                MaxDiscountAmount = Coupon.MaxDiscountAmount,
                MinOrderValue = Coupon.MinOrderValue,
                Quantity = Coupon.Quantity,
                UsedCount = Coupon.UsedCount,
                RemainingUsagePerUser = Coupon.MaxUsagePerUser - Coupon.Orders.Count(order => order.UserId == userId),
                StartDate = Coupon.StartDate,
                EndDate = Coupon.EndDate,
            };
        }
            

        private static readonly Expression<Func<CouponUsage, ShopCouponUsageResponse>> _couponUsageSelector =
            x => new ShopCouponUsageResponse
            {
                Id = x.Id,
                UserId = x.UserId,
                CouponId = x.CouponId,
                OrderId = x.OrderId,
                UsedDate = x.UsedDate,
            };



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopCouponResponse>> GetCouponsAsync(Guid userId)
        {
            var now = DateTime.UtcNow;
            return await _context.Coupons
                .Where(Coupon =>
                    Coupon.IsActive &&
                    Coupon.StartDate <= now && 
                    Coupon.EndDate >= now &&
                    Coupon.UsedCount < Coupon.Quantity &&
                    Coupon.CouponUsages.Count(vu => vu.UserId == userId && !vu.IsDeleted) < Coupon.MaxUsagePerUser
                )
                .Select(_couponSelector(userId))
                .ToListAsync();
        }

        public async Task<Coupon?> FindCouponByIdAsync(Guid CouponId)
        {
            return await _context.Coupons.FindAsync(CouponId);
        }

        public async Task<ShopCouponUsageResponse?> GetCouponUsageByIdAsync(int CouponUsageId)
        {
            return await _context.CouponUsages
                .Where(vu => vu.Id == CouponUsageId)
                .Select(_couponUsageSelector)
                .FirstOrDefaultAsync();
        }



        // --- WRITE METHODS --- //

        public void CreateCouponUsage(CouponUsage CouponUsage)
        {
            _context.CouponUsages.Add(CouponUsage);
        }
    }
}
