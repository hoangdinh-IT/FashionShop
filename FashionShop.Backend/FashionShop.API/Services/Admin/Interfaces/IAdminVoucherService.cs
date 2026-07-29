using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Models;

namespace FashionShop.API.Services.Admin.Interfaces
{
    public interface IAdminVoucherService
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request);
        Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId);



        // --- WRITE METHODS --- //

        Task<AdminVoucherResponse> CreateVoucherAsync(AdminCreateVoucherRequest request);
        Task<AdminVoucherResponse> UpdateVoucherAsync(Guid voucherId, AdminUpdateVoucherRequest request);
        Task DeleteVoucherAsync(Guid voucherId);
    }
}
