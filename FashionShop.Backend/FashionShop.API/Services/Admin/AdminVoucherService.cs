using AutoMapper;
using FashionShop.API.Repositories.Interfaces;
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
        private readonly IVoucherRepository _voucherRepository;
        private readonly IMapper _mapper;

        public AdminVoucherService(IVoucherRepository voucherRepository, IMapper mapper) 
        {
            _voucherRepository = voucherRepository;
            _mapper = mapper;
        }



        // --- READ METHODS --- //

        public async Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request)
        {
            return await _voucherRepository.GetPagedVouchers(request);
        }

        public async Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId)
        {
            return await _voucherRepository.GetVoucherByIdAsync(voucherId);
        }



        // --- WRITE METHODS --- //

        public async Task<AdminVoucherResponse> CreateVoucherAsync(CreateVoucherRequest request)
        {
            var isExistCode = await _voucherRepository.CheckExistCode(request.Code);

            if (isExistCode) throw new ConflictException("Code của voucher này đã tồn tại. Vui lòng chọn code khác!");

            var newVoucher = _mapper.Map<Voucher>(request);
            newVoucher.Id = Guid.NewGuid();
            var createdVoucher = await _voucherRepository.CreateVoucherAsync(newVoucher);
            return _mapper.Map<AdminVoucherResponse>(createdVoucher);
        }

        public async Task<AdminVoucherResponse> UpdateVoucherAsync(Guid voucherId, UpdateVoucherRequest request)
        {
            var existingVoucher = await _voucherRepository.FindVoucherByIdAsync(voucherId);

            if (existingVoucher == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            if (request.Code != existingVoucher.Code)
            {
                var isExistCode = await _voucherRepository.CheckExistCode(request.Code);

                if (isExistCode) throw new ConflictException("Code của voucher này đã tồn tại. Vui lòng chọn code khác!");
            }

            _mapper.Map(request, existingVoucher);
            existingVoucher.UpdatedDate = DateTime.UtcNow;

            var updatedVoucher = await _voucherRepository.UpdateVoucherAsync(existingVoucher);
            return _mapper.Map<AdminVoucherResponse>(updatedVoucher);
        }

        public async Task DeleteVoucherAsync(Guid voucherId)
        {
            var existingVoucher = await _voucherRepository.FindVoucherByIdAsync(voucherId);

            if (existingVoucher == null) throw new KeyNotFoundException("Không tìm thấy mã giảm giá!");

            await _voucherRepository.DeleteVoucherAsync(existingVoucher);
        }
    }
}
