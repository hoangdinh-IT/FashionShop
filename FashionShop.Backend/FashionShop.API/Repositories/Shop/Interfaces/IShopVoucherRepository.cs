using FashionShop.Core.Contracts.Shop.Voucher.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopVoucherRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopVoucherResponse>> GetVouchersAsync(Guid userId);
        Task<Voucher?> FindVoucherByIdAsync(Guid voucherId);
        Task<ShopVoucherUsageResponse?> GetVoucherUsageByIdAsync(int voucherUsageId);



        // --- WRITE METHODS --- //

        void CreateVoucherUsage(VoucherUsage voucherUsage);
    }
}
