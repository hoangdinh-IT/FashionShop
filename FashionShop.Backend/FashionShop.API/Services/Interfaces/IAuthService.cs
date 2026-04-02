using FashionShop.Core.Contracts.Auth;
using FashionShop.Core.Contracts.User.Responses;

namespace FashionShop.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse?> CreateUserAsync(RegisterRequest dto);
        Task<UserResponse?> LoginUserAsync(LoginRequest dto);
        Task<UserResponse> RefreshTokenAsync(RefreshTokenRequest request);
    }
}
