using FashionShop.Core.Contracts.Voucher.Requests;
using FashionShop.Core.Contracts.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models.Paging;
using FashionShop.Core.Models.Voucher;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IVoucherRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<VoucherResponse>> GetPagedVouchers(VoucherListRequest request);
        Task<VoucherResponse?> GetVoucherByIdAsync(Guid voucherId);
        Task<Voucher?> FindVoucherByIdAsync(Guid voucherId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistCode(string code);



        // --- WRITE METHODS --- //

        Task<Voucher> CreateVoucherAsync(Voucher voucher);
        Task<Voucher> UpdateVoucherAsync(Voucher voucher);
        Task DeleteVoucherAsync(Voucher voucher);
    }
}
