using FashionShop.Core.DTOs.Auth;
using FashionShop.Core.DTOs.User;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO?> CreateUserAsync(RegisterDTO dto);
        Task<UserDTO?> LoginUserAsync(LoginDTO dto);
    }
}
