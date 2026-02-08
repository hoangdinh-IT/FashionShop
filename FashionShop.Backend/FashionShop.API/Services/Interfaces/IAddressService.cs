using FashionShop.Core.DTOs.Address;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAddressService
    {
        Task<AddressDTO> CreateAddressAsync(CreateAddressDTO dto);
        Task<IEnumerable<AddressDTO>> GetAddressesByUserIdAsync(Guid userId);
        Task<AddressDTO?> UpdateAddressByUserIdAsync(Guid userId, Guid addressId, UpdateAddressDTO dto);
        Task DeleteAddressAsync(Guid userId, Guid addressId);
    }
}
