using FashionShop.Core.DTOs.User;

namespace FashionShop.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetUsersAsync();
        Task<UserDTO> GetUserByEmailAsync(string email);
        Task<UserDTO> UpdateUserAsync(Guid userId, UpdateUserDTO dto);
        Task DeleteUserAsync(Guid userId);
    }
}
