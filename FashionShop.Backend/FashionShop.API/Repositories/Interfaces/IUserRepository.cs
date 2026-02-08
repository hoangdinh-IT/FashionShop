using FashionShop.Core.Entities;

namespace FashionShop.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> IsUserExistsAsync(string email);
        Task<User?> CreateUserAsync(User user);
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
    }
}
