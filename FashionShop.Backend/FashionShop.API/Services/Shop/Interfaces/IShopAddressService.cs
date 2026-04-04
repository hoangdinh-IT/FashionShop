using FashionShop.Core.Contracts.Shop.Address.Requests;
using FashionShop.Core.Contracts.Shop.Address.Responses;

namespace FashionShop.API.Services.Shop.Interfaces
{
    public interface IShopAddressService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AddressResponse>> GetAddressesByUserIdAsync(Guid userId);



        // --- WRITE METHODS --- //

        Task<AddressResponse> CreateAddressAsync(CreateAddressRequest dto);
        Task<AddressResponse?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, UpdateAddressRequest dto);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
    }
}
