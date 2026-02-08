using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IAddressRepository
    {
        Task<int> CountAddressesByUserIdAsync(Guid userId);
        Task RemoveDefaultAddressAsync(Guid userId);
        Task<Address?> CreateAddressAsync(Address address);
        Task<IEnumerable<Address>> GetAddressesByUserIdAsync(Guid userId);
        Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId);
        Task<Address?> GetNewestAddressByUserIdAsync(Guid userId, Guid excludeAddressId);
        Task<Address?> UpdateAddressByUserIdAsync(Address address);
        Task DeleteAddressAsync(Address address);
    }
}
