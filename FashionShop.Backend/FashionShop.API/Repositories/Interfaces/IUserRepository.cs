using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IUserRepository
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
