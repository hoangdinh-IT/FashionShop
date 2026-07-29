using FashionShop.Core.Contracts.Shop.Voucher.Requests;
using FashionShop.Core.Contracts.Shop.Voucher.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopVoucherService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopVoucherResponse>> GetVouchersAsync(Guid userId);
    }
}
