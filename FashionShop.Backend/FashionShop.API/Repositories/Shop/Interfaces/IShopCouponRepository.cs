using FashionShop.Core.Contracts.Shop.Coupon.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopCouponRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopCouponResponse>> GetCouponsAsync(Guid userId);
        Task<Coupon?> FindCouponByIdAsync(Guid CouponId);
        Task<ShopCouponUsageResponse?> GetCouponUsageByIdAsync(int CouponUsageId);



        // --- WRITE METHODS --- //

        void CreateCouponUsage(CouponUsage CouponUsage);
    }
}
