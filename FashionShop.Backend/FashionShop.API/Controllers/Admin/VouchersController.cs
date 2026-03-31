using FashionShop.API.Services.Interfaces;
using FashionShop.Core.Contracts.Voucher.Requests;
using FashionShop.Core.Models.Voucher;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    public class VouchersController : AdminBaseApiControllers
    {
        private readonly IVoucherService _voucherService;

        public VouchersController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVoucher(CreateVoucherRequest request)
        {
            var result = await _voucherService.CreateVoucherAsync(request);
            return Created(result, "Thêm mới phiếu giảm giá thành công!");
        }

        [HttpGet]
        public async Task<IActionResult> GetVouchers([FromQuery] VoucherListRequest request) 
        {
            var result = await _voucherService.GetPagedVouchers(request);
            return Success(result, "Lấy danh sách phiếu giảm giá thành công!");
        }

        [HttpGet("{voucherId}")]
        public async Task<IActionResult> GetVoucherById(Guid voucherId)
        {
            var result = await _voucherService.GetVoucherByIdAsync(voucherId);
            return Success(result, "Lấy phiếu giảm giá thành công!");
        }

        [HttpPut("{voucherId}")]
        public async Task<IActionResult> UpdateVoucher(Guid voucherId, [FromBody] UpdateVoucherRequest request) 
        {
            var result = await _voucherService.UpdateVoucherAsync(voucherId, request);
            return Success(result, "Cập nhật phiếu giảm giá thành công!");
        }

        [HttpDelete("{voucherId}")]
        public async Task<IActionResult> DeleteVoucher(Guid voucherId)
        {
            await _voucherService.DeleteVoucherAsync(voucherId);
            return Success<object?>(null, "Xoá phiếu giảm giá thành công!");
        }
    }
}
