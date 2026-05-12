using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Shop.Interfaces
{
    public interface IShopUserRepository
    {

        // --- READ METHODS --- //

        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<User?> GetUserByEmailAsync(string email);



        // --- VALIDATION METHODS --- //

        Task<bool> CheckUserExistAsync(string email);



        // --- WRITE METHODS --- //

        void Create(User user);
        void Delete(User user);
    }
}
