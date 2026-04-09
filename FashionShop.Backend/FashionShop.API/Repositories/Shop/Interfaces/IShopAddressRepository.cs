using FashionShop.Core.Contracts.Shop.Address.Responses;
using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopAddressRepository
    {

        // --- READ METHODS --- //

        Task<int> CountAddressesByUserIdAsync(Guid userId);
        Task<IEnumerable<Address>> GetAddressesByUserIdAsync(Guid userId);
        Task<Address?> GetAddressByUserIdAsync(Guid userId, Guid addressId);
        Task<Address?> GetNewestAddressByUserIdAsync(Guid userId, Guid excludeAddressId);



        // --- WRITE METHODS --- //

        Task UnsetDefaultAddressAsync(Guid userId);
        void CreateAddress(Address address);
        void DeleteAddress(Address address);
    }
}
