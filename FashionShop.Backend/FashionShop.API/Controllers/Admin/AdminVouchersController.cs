using FashionShop.API.Services.Admin.Interfaces;
using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.API.Controllers.Admin
{
    [Route("api/admin/vouchers")]
    public class AdminVouchersController : AdminBaseApiControllers
    {
        private readonly IAdminVoucherService _voucherService;

        public AdminVouchersController(IAdminVoucherService voucherService)
        {
            _voucherService = voucherService;
        }



        // --- READ METHODS --- //

        [HttpGet]
        public async Task<IActionResult> GetVouchers([FromQuery] AdminVoucherListRequest request) 
        {
            var result = await _voucherService.GetPagedVouchers(request);
            return Success(result, "Lấy danh sách mã giảm giá thành công!");
        }

        [HttpGet("{voucherId}")]
        public async Task<IActionResult> GetVoucherById(Guid voucherId)
        {
            var result = await _voucherService.GetVoucherByIdAsync(voucherId);
            return Success(result, "Lấy mã giảm giá thành công!");
        }



        // --- WRITE METHODS --- //

        [HttpPost]
        public async Task<IActionResult> CreateVoucher(CreateVoucherRequest request)
        {
            var result = await _voucherService.CreateVoucherAsync(request);
            return Created(result, "Thêm mới mã giảm giá thành công!");
        }

        [HttpPut("{voucherId}")]
        public async Task<IActionResult> UpdateVoucher(Guid voucherId, [FromBody] UpdateVoucherRequest request) 
        {
            var result = await _voucherService.UpdateVoucherAsync(voucherId, request);
            return Success(result, "Cập nhật mã giảm giá thành công!");
        }

        [HttpDelete("{voucherId}")]
        public async Task<IActionResult> DeleteVoucher(Guid voucherId)
        {
            await _voucherService.DeleteVoucherAsync(voucherId);
            return Success<object?>(null, "Xoá mã giảm giá thành công!");
        }
    }
}
