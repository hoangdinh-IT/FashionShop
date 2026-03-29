using FashionShop.Core.Contracts.Address;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAddressService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<AddressDTO>> GetAddressesByUserIdAsync(Guid userId);

        // --- WRITE METHODS --- //
        Task<AddressDTO> CreateAddressAsync(CreateAddressDTO dto);
        Task<AddressDTO?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, UpdateAddressDTO dto);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
    }
}
