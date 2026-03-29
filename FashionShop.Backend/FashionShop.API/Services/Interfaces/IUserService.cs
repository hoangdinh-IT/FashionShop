using FashionShop.Core.Contracts.User;

namespace FashionShop.API.Services.Interfaces
{
    public interface IUserService
    {
        // --- READ METHODS --- //
        Task<IEnumerable<UserDTO>> GetUsersAsync();
        Task<UserDTO> GetUserByEmailAsync(string email);

        // --- WRITE METHODS --- //
        Task<UserDTO> UpdateUserAsync(Guid userId, UpdateUserDTO dto);
        Task DeleteUserAsync(Guid userId);
    }
}
