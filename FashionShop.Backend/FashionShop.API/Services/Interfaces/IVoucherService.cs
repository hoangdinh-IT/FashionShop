using FashionShop.Core.Contracts.Voucher.Requests;
using FashionShop.Core.Contracts.Voucher.Responses;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Voucher;

namespace FashionShop.API.Services.Interfaces
{
    public interface IVoucherService
    {

        // --- READ METHODS --- //

        Task<PagedResult<VoucherResponse>> GetPagedVouchers(VoucherListRequest request);
        Task<VoucherResponse?> GetVoucherByIdAsync(Guid voucherId);



        // --- WRITE METHODS --- //

        Task<VoucherResponse> CreateVoucherAsync(CreateVoucherRequest request);
        Task<VoucherResponse> UpdateVoucherAsync(Guid voucherId, UpdateVoucherRequest request);
        Task DeleteVoucherAsync(Guid voucherId);
    }
}
