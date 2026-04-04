using FashionShop.Core.Contracts.Address.Requests;
using FashionShop.Core.Contracts.Address.Responses;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAddressService
    {

        // --- READ METHODS --- //

        Task<IEnumerable<AddressResponse>> GetAddressesByUserIdAsync(Guid userId);



        // --- WRITE METHODS --- //

        Task<AddressResponse> CreateAddressAsync(CreateAddressRequest dto);
        Task<AddressResponse?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, UpdateAddressRequest dto);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
    }
}
