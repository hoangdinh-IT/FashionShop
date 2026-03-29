using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Contracts.User;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO?> CreateUserAsync(RegisterDTO dto);
        Task<UserDTO?> LoginUserAsync(LoginDTO dto);
    }
}
