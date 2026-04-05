using FashionShop.Core.Contracts.Admin.Voucher.Requests;
using FashionShop.Core.Contracts.Admin.Voucher.Responses;
using FashionShop.Core.Entities;
using FashionShop.Core.Models;

namespace FashionShop.API.Repositories.Admin.Interfaces
{
    public interface IAdminVoucherRepository
    {

        // --- READ METHODS --- //

        Task<PagedResult<AdminVoucherResponse>> GetPagedVouchers(AdminVoucherListRequest request);
        Task<AdminVoucherResponse?> GetVoucherByIdAsync(Guid voucherId);
        Task<Voucher?> FindVoucherByIdAsync(Guid voucherId);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckExistCode(string code);



        // --- WRITE METHODS --- //

        void CreateVoucher(Voucher voucher);
        void DeleteVoucher(Voucher voucher);
    }
}
