using FashionShop.Core.Contracts.Shop.Address.Requests;
using FashionShop.Core.Contracts.Shop.Address.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopAddressService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<ShopAddressResponse>> GetAddressesByUserIdAsync(Guid userId);



        // --- WRITE METHODS --- //

        Task<ShopAddressResponse> CreateAddressAsync(Guid userId, ShopCreateAddressRequest request);
        Task<ShopAddressResponse?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, ShopUpdateAddressRequest request);
        Task<ShopAddressResponse?> UpdateAddressDefaultAsync(Guid userId, Guid addressId);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
    }
}
