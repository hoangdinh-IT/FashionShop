using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IVoucherRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request);
        Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId);
        Task<Voucher?> FindVoucherByIdAsync(Guid voucherId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistCode(string code);



        // --- WRITE METHODS --- //

        Task<Voucher> CreateVoucherAsync(Voucher voucher);
        Task<Voucher> UpdateVoucherAsync(Voucher voucher);
        Task DeleteVoucherAsync(Voucher voucher);
    }
}
