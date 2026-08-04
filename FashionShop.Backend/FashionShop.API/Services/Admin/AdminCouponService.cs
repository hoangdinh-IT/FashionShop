using AutoMapper;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Coupon.Requests;
using FashionShop.Core.Contracts.Admin.Coupon.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminCouponService : IAdminCouponService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminCouponService(IUnitOfWork unitOfWork, IMapper mapper) 
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminCouponResponse>> GetPagedCoupons(AdminCouponListRequest request)
        {
            return await _unitOfWork.AdminCoupons.GetPagedCoupons(request);
        }

        public async Task<AdminCouponResponse?> GetCouponByIdAsync(Guid CouponId)
        {
            return await _unitOfWork.AdminCoupons.GetCouponByIdAsync(CouponId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminCouponResponse> CreateCouponAsync(AdminCreateCouponRequest request)
        {
            var isExistCode = await _unitOfWork.AdminCoupons.CheckExistCode(request.Code);

            if (isExistCode) throw new ConflictException("Code của Coupon này đã tồn tại. Vui lòng chọn code khác!");

            if (request.EndDate <= request.StartDate) throw new ArgumentException("Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu!");

            var newCoupon = _mapper.Map<Coupon>(request);
            newCoupon.Id = Guid.NewGuid();

            _unitOfWork.AdminCoupons.CreateCoupon(newCoupon);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminCouponResponse>(newCoupon);
        }

        public async Task<AdminCouponResponse> UpdateCouponAsync(Guid CouponId, AdminUpdateCouponRequest request)
        {
            var existingCoupon = await _unitOfWork.AdminCoupons.FindCouponByIdAsync(CouponId);

            if (existingCoupon == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            if (request.Code != existingCoupon.Code)
            {
                var isExistCode = await _unitOfWork.AdminCoupons.CheckExistCode(request.Code);

                if (isExistCode) throw new ConflictException("Code của Coupon này đã tồn tại. Vui lòng chọn code khác!");
            }

            _mapper.Map(request, existingCoupon);
            existingCoupon.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminCouponResponse>(existingCoupon);
        }

        public async Task DeleteCouponAsync(Guid CouponId)
        {
            var existingCoupon = await _unitOfWork.AdminCoupons.FindCouponByIdAsync(CouponId);

            if (existingCoupon == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            _unitOfWork.AdminCoupons.DeleteCoupon(existingCoupon);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
