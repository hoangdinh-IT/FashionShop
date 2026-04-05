using AutoMapper;
using FashionShop.API.Repositories.Admin.Interfaces;
using FashionShop.API.Repositories.Shared.Interfaces;
using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Exceptions;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin
{
    public class AdminVoucherService : IAdminVoucherService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminVoucherService(IUnitOfWork unitOfWork, IMapper mapper) 
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request)
        {
            return await _unitOfWork.AdminVouchers.GetPagedVouchers(request);
        }

        public async Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId)
        {
            return await _unitOfWork.AdminVouchers.GetVoucherByIdAsync(voucherId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminVoucherResponse> CreateVoucherAsync(CreateVoucherRequest request)
        {
            var isExistCode = await _unitOfWork.AdminVouchers.CheckExistCode(request.Code);

            if (isExistCode) throw new ConflictException("Code của voucher này đã tồn tại. Vui lòng chọn code khác!");

            if (request.EndDate <= request.StartDate) throw new ArgumentException("Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu!");

            var newVoucher = _mapper.Map<Voucher>(request);
            newVoucher.Id = Guid.NewGuid();

            _unitOfWork.AdminVouchers.CreateVoucher(newVoucher);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminVoucherResponse>(newVoucher);
        }

        public async Task<AdminVoucherResponse> UpdateVoucherAsync(Guid voucherId, UpdateVoucherRequest request)
        {
            var existingVoucher = await _unitOfWork.AdminVouchers.FindVoucherByIdAsync(voucherId);

            if (existingVoucher == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            if (request.Code != existingVoucher.Code)
            {
                var isExistCode = await _unitOfWork.AdminVouchers.CheckExistCode(request.Code);

                if (isExistCode) throw new ConflictException("Code của voucher này đã tồn tại. Vui lòng chọn code khác!");
            }

            _mapper.Map(request, existingVoucher);
            existingVoucher.UpdatedDate = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<AdminVoucherResponse>(existingVoucher);
        }

        public async Task DeleteVoucherAsync(Guid voucherId)
        {
            var existingVoucher = await _unitOfWork.AdminVouchers.FindVoucherByIdAsync(voucherId);

            if (existingVoucher == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            _unitOfWork.AdminVouchers.DeleteVoucher(existingVoucher);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
