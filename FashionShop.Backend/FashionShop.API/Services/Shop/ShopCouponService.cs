using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Shop.Interfaces;
using FashionShop.Core.Contracts.Shop.Coupon.Requests;
using FashionShop.Core.Contracts.Shop.Coupon.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Services.Shop
{
    public class ShopCouponService : IShopCouponService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShopCouponService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<IEnumerable<ShopCouponResponse>> GetCouponsAsync(Guid userId)
        {
            return await _unitOfWork.ShopCoupons.GetCouponsAsync(userId);
        }
    }
}
