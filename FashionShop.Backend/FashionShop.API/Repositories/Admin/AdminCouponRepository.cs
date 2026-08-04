using FashionShop.API.Data;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using FashionShop.Core.Contracts.Admin.Coupon.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Extensions;
using FashionShop.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FashionShop.API.Repositories.Admin
{
    public class AdminCouponRepository : IAdminCouponRepository
    {
        private readonly FashionDbContext _context;

        private static readonly Expression<Func<Coupon, AdminCouponResponse>> _CouponSelector =
            x => new AdminCouponResponse
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Description = x.Description,
                DiscountType = x.DiscountType,
                DiscountAmount = x.DiscountAmount,
                MaxDiscountAmount = x.MaxDiscountAmount,
                MinOrderValue = x.MinOrderValue,
                Quantity = x.Quantity,
                UsedCount = x.UsedCount,
                MaxUsagePerUser = x.MaxUsagePerUser,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                IsDeleted = x.IsDeleted,
            };

        public AdminCouponRepository(FashionDbContext context)
        {
            _context = context;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminCouponResponse>> GetPagedCoupons(AdminCouponListRequest request)
        {
            var query = _context.Coupons.AsNoTracking().AsQueryable();

            query = query.FilterByKeyword(request.Keyword)
                         .FilterByDiscountType(request.DiscountType)
                         .FilterByActive(request.IsActive)
                         .FilterByDate(request.FromDate, request.ToDate)
                         .FilterByStatus(request.Status)
                         .FilterByAvailable(request.IsAvailable)
                         .FilterByMinOrderValue(request.FromMinOrderValue, request.ToMinOrderValue)
                         .Sort(request.SortBy, request.IsAscending);

            var totalRecord = await query.CountAsync();

            var data = await query.Skip((request.PageIndex - 1) * request.PageSize)
                                  .Take(request.PageSize)
                                  .Select(_CouponSelector)
                                  .ToListAsync();

            return new PagedResult<AdminCouponResponse>
            {
                Items = data,
                TotalRecord = totalRecord,
                PageSize = request.PageSize,
                PageIndex = request.PageIndex
            };
        }

        public async Task<AdminCouponResponse?> GetCouponByIdAsync(Guid CouponId)
        {
            return await _context.Coupons
                .Where(x => x.Id == CouponId)
                .Select(_CouponSelector)
                .FirstOrDefaultAsync();
        }

        public async Task<Coupon?> FindCouponByIdAsync(Guid CouponId)
            => await _context.Coupons.FindAsync(CouponId);



        // --- VALIDATION METHODS --- //

        public async Task<bool> CheckExistCode(string code)
            => await _context.Coupons.AnyAsync(x => x.Code.ToLower() == code.ToLower());



        // --- WRITE METHODS --- //

        public void CreateCoupon(Coupon Coupon)
        {
            _context.Coupons.Add(Coupon);
        }

        public void DeleteCoupon(Coupon Coupon)
        {
            Coupon.IsDeleted = true;
        }
    }
}
