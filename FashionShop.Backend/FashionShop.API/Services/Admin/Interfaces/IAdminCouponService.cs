using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using FashionShop.Core.Contracts.Admin.Coupon.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminCouponService
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminCouponResponse>> GetPagedCoupons(AdminCouponListRequest request);
        Task<AdminCouponResponse?> GetCouponByIdAsync(Guid CouponId);



        // --- WRITE METHODS --- //

        Task<AdminCouponResponse> CreateCouponAsync(AdminCreateCouponRequest request);
        Task<AdminCouponResponse> UpdateCouponAsync(Guid CouponId, AdminUpdateCouponRequest request);
        Task DeleteCouponAsync(Guid CouponId);
    }
}
