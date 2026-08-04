using FashionShop.Core.Contracts.Shop.Coupon.Requests;
using FashionShop.Core.Contracts.Shop.Coupon.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopCouponService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopCouponResponse>> GetCouponsAsync(Guid userId);
    }
}
