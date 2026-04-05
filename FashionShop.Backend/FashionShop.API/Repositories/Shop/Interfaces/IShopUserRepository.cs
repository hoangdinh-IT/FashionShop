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

        Task<bool> IsUserExistsAsync(string email);



        // --- WRITE METHODS --- //

        Task<User?> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }
}
