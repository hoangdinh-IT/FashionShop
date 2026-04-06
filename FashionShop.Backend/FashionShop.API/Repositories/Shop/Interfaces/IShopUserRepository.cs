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

        void CreateUser(User user);
        void DeleteUser(User user);
    }
}
