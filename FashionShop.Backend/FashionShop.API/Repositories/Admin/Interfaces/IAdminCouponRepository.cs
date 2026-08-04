using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using FashionShop.Core.Contracts.Admin.Coupon.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminCouponRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminCouponResponse>> GetPagedCoupons(AdminCouponListRequest request);
        Task<AdminCouponResponse?> GetCouponByIdAsync(Guid CouponId);
        Task<Coupon?> FindCouponByIdAsync(Guid CouponId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistCode(string code);



        // --- WRITE METHODS --- //

        void CreateCoupon(Coupon Coupon);
        void DeleteCoupon(Coupon Coupon);
    }
}
