using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IAddressRepository
    {
        // --- READ METHODS --- //
        Task<int> CountAddressesByUserIdAsync(Guid userId);
        Task<IEnumerable<Address>> GetAddressesByUserIdAsync(Guid userId);
        Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId);
        Task<Address?> GetNewestAddressByUserIdAsync(Guid userId, Guid excludeAddressId);

        // --- WRITE METHODS --- //
        Task UnsetDefaultAddressAsync(Guid userId);
        Task<Address?> CreateAddressAsync(Address address);
        Task<Address?> UpdateAddressByUserIdAsync(Address address);
        Task DeleteAddressAsync(Address address);
    }
}
